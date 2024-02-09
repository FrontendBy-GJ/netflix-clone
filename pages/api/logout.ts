import { removeTokenCookie } from '@/lib/cookies';
import { magicAdmin } from '@/lib/magic-link-server';
import { verifyToken } from '@/lib/utils';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function (req: NextApiRequest, res: NextApiResponse) {
  try {
    if (!req.cookies.token)
      return res.status(401).json({ message: 'User is not logged in' });

    const token = req.cookies.token;

    const userId = (await verifyToken(token)) as string;
    removeTokenCookie(res);

    try {
      (await magicAdmin).users.logoutByIssuer(userId);
    } catch (error) {
      console.error('Error occurred while logging out magic user', error);
    }

    res.writeHead(302, { Location: '/login' });
    res.end();
  } catch (error) {
    console.error({ error });
    res.status(401).json({ message: 'User is not logged in' });
  }
}
