import cn from 'classnames';
import { getYoutubeVideoId } from '@/lib/youtube-api';
import { useRouter } from 'next/router';
import { GetStaticPropsContext } from 'next';
import ReactModal from 'react-modal';
import Modal from 'react-modal';
import Like from '@/components/Like';
import Dislike from '@/components/Dislike';
import Navbar from '@/components/Navbar';
import { useEffect, useState } from 'react';
import { IBM_Plex_Sans, IBM_Plex_Sans_Condensed } from 'next/font/google';
import Head from 'next/head';
import classNames from 'classnames';
Modal.setAppElement('#__next');

const ibmPlexSansCondensed = IBM_Plex_Sans_Condensed({
  subsets: ['latin'],
  weight: '500',
  variable: '--font-ibm-condensed',
});

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-ibm-sans',
});

export const getStaticProps = async (context: GetStaticPropsContext) => {
  const videoId = context.params?.videoId;

  const videoArray = await getYoutubeVideoId(videoId as string);

  return {
    props: {
      video: videoArray.length > 0 ? videoArray[0] : {},
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const listOfVideos = ['mYfJxlgR2jw', '4zH5iYM4wJo', 'KCPEHsAViiQ'];

  const paths = listOfVideos.map((videoId) => ({
    params: { videoId },
  }));

  return { paths, fallback: 'blocking' };
};

type VideoProps = {
  video: {
    title: string;
    publishTime: string;
    description: string;
    channelTitle: string;
    viewCount: number;
    statistics: {
      viewCount: number;
    };
  };
};

const Video = ({ video }: VideoProps) => {
  const [likeStatus, setLikeStatus] = useState<boolean | null>(null);

  const {
    title,
    publishTime,
    description,
    channelTitle,
    statistics: { viewCount } = { viewCount: 0 },
  } = video;
  const router = useRouter();
  const videoId = router.query.videoId;
  const date = new Date(publishTime);
  const formatDate = date.toDateString().split(' ').slice(1).join(' ');
  const formattedViewCount = Number(viewCount).toLocaleString();

  const handleLikeStatus = async (status: boolean) => {
    setLikeStatus(status);

    return await fetch('/api/stats', {
      method: 'POST',
      body: JSON.stringify({
        videoId,
        favorited: status ? 1 : 0,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  };

  useEffect(() => {
    const getVideoLikeStatus = async () => {
      const res = await fetch(`/api/stats?videoId=${videoId}`, {
        method: 'GET',
      });
      const data = await res.json();
      if (data.length > 0) {
        const favorited = data[0].favorited;
        favorited === 1 ? setLikeStatus(true) : setLikeStatus(false);
      }
    };
    getVideoLikeStatus();
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <Navbar />
      <ReactModal
        isOpen
        contentLabel="Watch video"
        onRequestClose={() => router.back()}
        className={`max-w-screen-md mx-auto bg-stone-900 h-fit font-ibm-sans ${ibmPlexSansCondensed.variable} ${ibmPlexSans.variable}`}
        overlayClassName={
          'inset-0 bg-black h-[calc(100vh-4.5rem)] overflow-hidden mt-[4.5rem] overflow-y-scroll font-ibm-sans'
        }
      >
        <iframe
          id="ytplayer"
          width="100%"
          height="360"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&origin=http://example.com`}
          className="mx-auto"
        ></iframe>

        {/*  */}
        <div className="grid max-w-2xl gap-1 p-4 mx-auto mt-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <h3 className="mt-4 text-xl font-semibold md:mt-0 font-ibm-condensed md:text-2xl">
              {title}
            </h3>
            <time
              dateTime={date.toISOString().split('T')[0]}
              className="text-sm text-stone-400"
            >
              {formatDate}
            </time>
            <p className="mt-4 leading-7 md:mt-14 text-balance md:w-[140%]">
              {description}
            </p>
          </div>
          {/*  */}
          <div className="flex justify-between row-start-1 text-sm md:pl-4 md:flex-col md:gap-4 h-fit md:col-start-3 md:border-l border-stone-400">
            <div className="flex flex-col text-balance">
              <p>
                <span className="text-stone-400">Channel: </span>
                {channelTitle}
              </p>
              <p>
                <span className="text-stone-400">Views: </span>
                {formattedViewCount}
              </p>
            </div>
            <div className="flex max-w-[12rem] gap-4 grow md:grow-0">
              <button
                onClick={() => handleLikeStatus(true)}
                className="flex items-center justify-center h-10 bg-transparent border rounded grow border-stone-400 aspect-square group"
              >
                <Like fill="none" selected={likeStatus === true} />
              </button>
              <button
                onClick={() => handleLikeStatus(false)}
                className="flex items-center justify-center h-10 bg-transparent border rounded grow border-stone-400 aspect-square group"
              >
                <Dislike fill="none" selected={likeStatus === false} />
              </button>
            </div>
          </div>
        </div>
      </ReactModal>
    </>
  );
};

export default Video;
