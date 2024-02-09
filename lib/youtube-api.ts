import dummyData from '../data/data.json';

interface DataItems {
  id: { videoId: string };
  snippet: {
    title: string;
    publishedAt: string;
    description: string;
    channelTitle: string;
    thumbnails: {
      high: {
        url: string;
      };
    };
  };
  statistics: {
    viewCount: number;
  };
}

const fetchVideos = async (url: string) => {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const BASE_URL = 'youtube.googleapis.com/youtube/v3';
  const res = await fetch(
    `https://${BASE_URL}/${url}&maxResults=15&key=${API_KEY}`
  );

  return await res.json();
};

export const getCommonVideos = async (url: string) => {
  try {
    const data =
      process.env.NODE_ENV === 'development'
        ? dummyData
        : await fetchVideos(url);

    if (data?.error) {
      console.error('Youtube APi error', data.error);
      return [];
    }

    return data?.items.map((item: DataItems) => {
      const id = item.id?.videoId || item.id;
      const snippet = item.snippet;
      return {
        title: snippet?.title,
        imgUrl: `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`,
        id,
        description: snippet.description,
        publishTime: snippet.publishedAt,
        channelTitle: snippet.channelTitle,
        statistics: item.statistics ? item.statistics : { viewCount: 0 },
      };
    });
  } catch (error) {
    console.error('Something went wrong with video library', error);
    return [];
  }
};

export const getVideos = (searchQuery: string) => {
  const URL = `search?part=snippet&order=relevance&q=${searchQuery}&type=video`;

  return getCommonVideos(URL);
};

export const getPopularVideos = () => {
  const URL =
    'videos?part=snippet%2CcontentDetails%2Cstatistics&chart=mostPopular&regionCode=US';

  return getCommonVideos(URL);
};

export const getYoutubeVideoId = (videoId: string) => {
  const URL = `videos?part=snippet%2CcontentDetails%2Cstatistics&id=${videoId}`;

  return getCommonVideos(URL);
};
