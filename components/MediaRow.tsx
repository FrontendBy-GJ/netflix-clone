import { VideoProps } from '@/pages';
import Card, { SizeType } from './Card';
import Link from 'next/link';
import cn from 'classnames';

type MediaRowProps = {
  category: string;
  video: VideoProps[];
  cardSize?: SizeType;
  flexWrap?: boolean;
  hoverEffect?: boolean;
};
const MediaRow = ({
  category,
  video = [],
  cardSize,
  flexWrap = false,
  hoverEffect,
}: MediaRowProps) => {
  return (
    <section
      className={cn('px-4 my-4 md:px-6', {
        'overflow-hidden': flexWrap,
      })}
    >
      <h2 className="text-2xl font-semibold capitalize font-ibm-condensed">
        {category}
      </h2>
      <div
        className={cn(
          'flex space-x-2 overflow-x-auto no-scrollbar px-4 py-8 md:max-w-screen-2xl mx-auto w-full',
          {
            'grid place-items-center gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4':
              flexWrap,
          }
        )}
      >
        {video.map((v) => {
          return (
            <Link key={v.id} href={`/video/${v.id}`} scroll={false}>
              <Card
                cardImgUrl={v.imgUrl}
                size={cardSize}
                title={v.title}
                hoverEffect={hoverEffect}
              />
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default MediaRow;
