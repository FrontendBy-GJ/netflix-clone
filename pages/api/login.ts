import { magicAdmin } from '@/lib/magic-link-server';
import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'jsonwebtoken';
import { isNewUser, createNewUser } from '@/lib/db/hasura';
import { setTokenCookie } from '@/lib/cookies';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const auth = req.headers.authorization;
      const didToken = auth ? auth?.substring(7) : '';
      const metaData = await (
        await magicAdmin
      ).users.getMetadataByToken(didToken);

      // create jwt
      const token = jwt.sign(
        {
          ...metaData,
          iat: Math.floor(Date.now() / 1000),
          exp: Math.floor(Date.now() / 1000 + 7 * 24 * 60 * 60),
          'https://hasura.io/jwt/claims': {
            'x-hasura-default-role': 'user',
            'x-hasura-allowed-roles': ['user', 'admin'],
            'x-hasura-user-id': `${metaData.issuer}`,
          },
        },
        `${process.env.JWT_SECRET}`
      );

      // CHECK IF USER EXISTS
      const isNewUserQuery = await isNewUser(token, metaData.issuer as string);

      isNewUserQuery && (await createNewUser(token, metaData));
      setTokenCookie(token, res);
      res.send({ done: true });
    } catch (error) {
      console.error('Something went wrong logging in:', error);
      res.status(500).send({ done: false });
    }
  } else {
    res.send({ done: false });
  }
}
