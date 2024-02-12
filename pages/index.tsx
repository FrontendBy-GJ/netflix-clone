import Banner from '@/components/Banner';
import MediaRow from '@/components/MediaRow';
import Navbar from '@/components/Navbar';

import { getPopularVideos, getVideos } from '@/lib/youtube-api';
import { GetServerSideProps } from 'next';
import Head from 'next/head';

import { getWatchAgainVideos } from '@/lib/db-api';
import { redirectUser } from '@/utils/redirectUser';

export type VideoProps = {
  imgUrl: string;
  title: string;
  id: string;
};

export const getServerSideProps: GetServerSideProps<{
  videos: VideoProps[];
}> = async (context) => {
  const { token, userId } = await redirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  const videos = await getVideos('sports');

  const technologyVideos = await getVideos('technology');

  const travelVideos = await getVideos('travel');

  const popularVideos = await getPopularVideos();

  const watchAgainVideos = await getWatchAgainVideos(token as string, userId);

  return {
    props: {
      videos,
      technologyVideos,
      travelVideos,
      popularVideos,
      watchAgainVideos,
    },
  };
};

interface HomeProps {
  videos: VideoProps[];
  technologyVideos: VideoProps[];
  travelVideos: VideoProps[];
  popularVideos: VideoProps[];
  watchAgainVideos: VideoProps[];
}

export default function Home({
  videos,
  technologyVideos,
  travelVideos,
  popularVideos,
  watchAgainVideos,
}: HomeProps) {
  const randomIndexBannerVideo = Math.floor(
    Math.random() * popularVideos.length
  );

  return (
    <>
      <Head>
        <title>Netflix</title>
      </Head>
      <Navbar />
      <main>
        <Banner
          videoId={popularVideos[randomIndexBannerVideo]?.id}
          title={popularVideos[randomIndexBannerVideo]?.title}
          subTitle={popularVideos[randomIndexBannerVideo]?.title}
          imgUrl={popularVideos[randomIndexBannerVideo]?.imgUrl}
        />

        <MediaRow category="Sports" video={videos} cardSize="small" />
        {watchAgainVideos.length > 0 && (
          <MediaRow
            category="Watch it again"
            video={watchAgainVideos}
            cardSize="small"
          />
        )}
        <MediaRow
          category="Technology"
          video={technologyVideos}
          cardSize="small"
        />
        <MediaRow category="Travel" video={travelVideos} cardSize="small" />
        <MediaRow category="Popular" video={popularVideos} cardSize="small" />
      </main>

      <footer>
        <small className="pb-4 pl-4 text-stone-400">
          <a
            className="hover:underline underline-offset-4"
            target="_blank"
            href="https://icons8.com/icon/20519/netflix"
          >
            Netflix
          </a>{' '}
          icon by{' '}
          <a
            className="italic hover:underline underline-offset-4"
            target="_blank"
            href="https://icons8.com"
          >
            Icons8
          </a>
        </small>
      </footer>
    </>
  );
}
