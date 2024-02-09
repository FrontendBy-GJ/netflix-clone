import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import {
  AnimatePresence,
  motion as m,
  useScroll,
  useTransform,
} from 'framer-motion';
import { magic } from '@/lib/magic-link';

const Navbar = () => {
  const [username, setUsername] = useState('');
  const [isopen, setIsopen] = useState(false);
  const [didToken, setDidToken] = useState('');
  const router = useRouter();

  const closeDropdown = () => setIsopen(false);

  const handleClickOutside = (e: MouseEvent) => {
    if (e.target && (e.target as Element).closest('.dropdown')) return;
    closeDropdown();
  };

  const handleEscKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeDropdown();
  };

  useEffect(() => {
    if (isopen) {
      document.addEventListener('click', handleClickOutside);
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [isopen]);

  useEffect(() => {
    async function getUsername() {
      try {
        const { email } = await magic.user.getInfo();
        const didToken = await magic.user.getIdToken();

        if (email) {
          setUsername(email);
          setDidToken(didToken);
        }
      } catch (error) {
        console.error('Error retrieving email:', error);
      }
    }
    getUsername();
  }, []);

  const { scrollYProgress } = useScroll();
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.2],
    ['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 1)']
  );

  const onSignOutClick = async () => {
    try {
      const response = await fetch('/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${didToken}`,
        },
      });
      return await response.json();
    } catch (error) {
      console.error('Error logging out:', error);
      router.push('/login');
    }
  };

  return (
    <m.div
      style={{ backgroundColor }}
      className="fixed z-[99999] inset-x-0 top-0"
    >
      <section className="flex items-center justify-between px-4 py-4 mx-auto max-w-screen-2xl md:px-6">
        <Link
          href={'/'}
          className="relative h-10 rounded w-28 focus"
          tabIndex={0}
        >
          <Image
            src={'/static/netflix-logo.svg'}
            alt="Netflix"
            fill={true}
            className="object-cover w-auto h-auto p-1"
          />
        </Link>

        <ul className="flex-grow hidden ml-12 space-x-10 md:flex">
          <li>
            <Link
              href={'/'}
              scroll={false}
              tabIndex={0}
              className="p-1 rounded focus"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              href={'/browse/my-list'}
              scroll={false}
              tabIndex={0}
              className="p-1 rounded focus"
            >
              My List
            </Link>
          </li>
        </ul>
        {username && (
          <div className="relative dropdown">
            <m.button
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              aria-pressed={isopen}
              className="flex items-center p-1 gap-1.5 focus rounded"
              onClick={() => setIsopen(!isopen)}
            >
              <span className="text-sm duration-300 sm:text-base">
                {username}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`w-5 h-5 ${isopen ? 'rotate-180' : ''} duration-300`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
            </m.button>
            <AnimatePresence>
              {isopen && (
                <m.div
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="z-[10000] right-0 top-9 w-full absolute flex flex-col text-center rounded bg-stone-800 gap-1"
                >
                  <Link
                    href={'/browse/my-list'}
                    tabIndex={isopen ? 0 : 1}
                    scroll={false}
                    className="block w-full py-2 overflow-hidden rounded bg-stone-800 md:hidden hover:bg-stone-900 focus"
                  >
                    My List
                  </Link>
                  <Link
                    href={'/login'}
                    tabIndex={isopen ? 0 : 1}
                    className="block w-full py-2 overflow-hidden rounded bg-stone-800 hover:bg-stone-900 focus"
                    onClick={onSignOutClick}
                  >
                    Sign out
                  </Link>
                </m.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </section>
    </m.div>
  );
};

export default Navbar;
