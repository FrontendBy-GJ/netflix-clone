import { NextApiRequest, NextApiResponse } from 'next';
import { updateStats, findVideoByUserId, insertStats } from '@/lib/db/hasura';
import { verifyToken } from '@/lib/utils';

export default async function stats(req: NextApiRequest, res: NextApiResponse) {
  try {
    const token = req ? req.cookies.token : null;
    if (!token) {
      res.status(403).send({});
    } else {
      const inputParams = req.method === 'POST' ? req.body : req.query;
      const { videoId } = inputParams;

      if (videoId) {
        const userId = (await verifyToken(token)) as string;
        const findVideo = await findVideoByUserId(token, userId, videoId);
        const doesStatsExist = findVideo?.length > 0;

        if (req.method === 'POST') {
          const { watched = true, favorited } = req.body;

          if (doesStatsExist) {
            // update it
            const response = await updateStats(token, {
              watched,
              userId,
              videoId,
              favorited,
            });
            res.send({
              data: response,
            });
          } else {
            // add it
            const response = await insertStats(token, {
              watched,
              userId,
              videoId,
              favorited,
            });
            res.send({
              data: response,
            });
          }
        } else {
          if (doesStatsExist) {
            res.send(findVideo);
          } else {
            // add it
            res.status(404);
            res.send({ user: null, message: 'Video not found' });
          }
        }
      }
    }
  } catch (error) {
    console.error('Error occurred /stats', error);
    res.status(500).send({ done: false, error: error });
  }
}
