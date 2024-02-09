import Loading from '@/components/Loading';
import { magic } from '@/lib/magic-link';
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { IBM_Plex_Sans_Condensed, IBM_Plex_Sans } from 'next/font/google';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

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

export default function App({ Component, pageProps }: AppProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkUserIsSignedIn = async () => {
      const isLoggedIn = await magic.user.isLoggedIn();

      if (isLoggedIn) {
        router.push('/');
      } else {
        router.push('/login');
      }
    };
    checkUserIsSignedIn();
  }, []);

  useEffect(() => {
    const handleComplete = () => setIsLoading(false);
    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);
    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  return (
    <>
      {isLoading ? (
        <Loading />
      ) : (
        <div
          className={`${ibmPlexSansCondensed.variable} ${ibmPlexSans.variable} font-ibm-sans`}
        >
          <Component {...pageProps} />
        </div>
      )}
    </>
  );
}
