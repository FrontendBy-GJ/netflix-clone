import Image from 'next/image';
import { useState } from 'react';
import { motion as m } from 'framer-motion';
import cn from 'classnames';
import { decodeHtml } from '@/utils/decodeHtml.utils';

export type SizeType = 'large' | 'medium' | 'small';
type CardProps = {
  cardImgUrl: string;
  size?: SizeType;
  title?: string;
  hoverEffect?: boolean;
};

const Card = ({
  cardImgUrl = '/static/netflix-logo.svg',
  size = 'large',
  title,
  hoverEffect = true,
}: CardProps) => {
  const [cardImgSrc, setCardImgSrc] = useState(cardImgUrl);

  const handleImageError = () => setCardImgSrc('/static/netflix-logo.svg');

  const decodedTitle = title ? decodeHtml(title) : null;

  const scale = hoverEffect && {
    scale: 1.1,
    zIndex: 1,
    transition: { duration: 0.35 },
  };

  return (
    <m.div
      tabIndex={0}
      whileHover={{ ...scale }}
      className={cn(
        'relative shrink-0 cursor-pointer isolate group rounded overflow-hidden focus-card',
        'after:hover:absolute after:hover:inset-0 after:hover:bg-gradient-to-t after:hover:from-stone-950 after:hover:to-transparent',
        { 'h-96 w-56': size === 'large' },
        { 'h-64 w-44': size === 'medium' },
        { 'h-44 aspect-video': size === 'small' },
        { 'after:hover:bg-none': !title }
      )}
    >
      <Image
        src={cardImgSrc}
        onError={handleImageError}
        alt=""
        fill={true}
        className={cn('w-full h-full object-cover object-bottom', {
          'object-cover object-center': size === 'small',
        })}
        sizes="(max-width: 768px) 100vw"
      />
      <p className="absolute z-50 hidden px-3 text-sm bottom-2 group-hover:block text-balance">
        {decodedTitle}
      </p>
    </m.div>
  );
};

export default Card;
