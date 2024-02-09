import MediaRow from '@/components/MediaRow';
import Navbar from '@/components/Navbar';
import { getMyListVideos } from '@/lib/db-api';
import useRedirectUser from '@/utils/redirectUser';
import { GetServerSidePropsContext, PreviewData } from 'next';
import Head from 'next/head';
import { ParsedUrlQuery } from 'querystring';
import { VideoProps } from '..';
import { generateKey } from '@/utils/generateKey';

export const getServerSideProps = async (
  context: GetServerSidePropsContext<ParsedUrlQuery, PreviewData>
) => {
  const { token, userId } = await useRedirectUser(context);

  if (!userId) {
    return {
      props: {},
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }

  let myListVideos;
  if (token) {
    myListVideos = await getMyListVideos(token, userId);
  }

  return {
    props: {
      myListVideos,
    },
  };
};

type MyListProps = {
  myListVideos: VideoProps[];
};

const MyList = ({ myListVideos }: MyListProps) => {
  return (
    <>
      <Head>
        <title>My List</title>
      </Head>
      <Navbar />
      <main>
        <div className="h-[calc(100vh-4.5rem)] mt-[4.5rem] text-white pt-4">
          <MediaRow
            category="My List"
            video={myListVideos}
            cardSize="small"
            flexWrap={true}
            hoverEffect={false}
          />
        </div>
      </main>
    </>
  );
};

export default MyList;
