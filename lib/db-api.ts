import { myListVideos, watchAgainVideos } from './db/hasura';

type Video = {
  videoId: string;
};

export async function getWatchAgainVideos(token: string, userId: string) {
  const videos: Video[] = await watchAgainVideos(token, userId);
  return videos?.map((video: Video) => ({
    id: video.videoId,
    imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
  }));
}

export async function getMyListVideos(token: string, userId: string) {
  const videos: Video[] = await myListVideos(token, userId);
  return videos?.map((video: Video) => ({
    id: video.videoId,
    imgUrl: `https://i.ytimg.com/vi/${video.videoId}/maxresdefault.jpg`,
  }));
}
