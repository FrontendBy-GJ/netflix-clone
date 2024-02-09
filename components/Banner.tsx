import { decodeHtml } from '@/utils/decodeHtml.utils';
import { useRouter } from 'next/router';
import { motion as m } from 'framer-motion';

type BannerProps = {
  title: string;
  subTitle?: string;
  imgUrl: string;
  videoId: string;
};

const Banner = ({ title, imgUrl, videoId }: BannerProps) => {
  const router = useRouter();

  const decodedTitle = decodeHtml(title);

  const onPlayBtnClick = () => {
    router.push(`/video/${videoId}`);
  };

  return (
    <div
      style={{
        backgroundImage: `url(${imgUrl})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
      }}
      className="p-4 md:p-6 h-[80vh] z-50 relative after:-z-10 after:absolute after:inset-0 after:bg-gradient-to-t after:from-black after:via-transparent after:to-black bg-center lg:bg-top"
    >
      <m.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative flex flex-col justify-end h-full space-y-4 lg:w-1/2 isolate"
      >
        <h2 className="text-2xl font-semibold md:text-3xl text-balance font-ibm-condensed">
          {decodedTitle}
        </h2>

        <button
          className="flex gap-1 px-4 py-2 text-black transition-colors rounded-md shadow-xl cursor-pointer bg-slate-50 w-fit hover:bg-slate-200 focus"
          onClick={onPlayBtnClick}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-6 h-6"
          >
            <path
              fillRule="evenodd"
              d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z"
              clipRule="evenodd"
            />
          </svg>
          Play
        </button>
      </m.div>
    </div>
  );
};

export default Banner;
