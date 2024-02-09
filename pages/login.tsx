import { magic } from '@/lib/magic-link';
import { motion as m } from 'framer-motion';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { ChangeEvent, MouseEvent, useEffect, useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const handleComplete = () => setIsLoading(false);

    router.events.on('routeChangeComplete', handleComplete);
    router.events.on('routeChangeError', handleComplete);

    return () => {
      router.events.off('routeChangeComplete', handleComplete);
      router.events.off('routeChangeError', handleComplete);
    };
  }, [router]);

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    setEmail(e.target.value);
    setMessage('');
  };

  const onSignInClick = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    if (email) {
      try {
        setIsLoading(true);
        const didToken = await magic.auth.loginWithMagicLink({
          email,
        });
        if (didToken) {
          const res = await fetch('/api/login', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${didToken}`,
              'Content-Type': 'application/json',
            },
          });
          const loggedInResponse = await res.json();
          if (loggedInResponse.done) {
            router.push('/');
          } else {
            setMessage('Something went wrong loggin in');
            setIsLoading(false);
          }
        }
      } catch (error) {
        console.error('Something went wrong while trying to sign in', error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
      setMessage('Enter a valid email address');
    }
  };

  return (
    <>
      <Head>
        <title>Netflix Signin</title>
      </Head>
      <div className="bg-[url('/static/netflix-background.jpeg')] bg-no-repeat h-[100vh] z-50 relative after:absolute after:inset-0 after:-z-10 after:bg-stone-950 after:bg-opacity-70">
        <header className="px-4 py-4 md:px-6">
          <div className="relative block h-10 w-28">
            <Image
              src={'/static/netflix-logo.svg'}
              alt="Netflix"
              fill={true}
              className="object-cover w-auto h-auto outline"
            />
          </div>
        </header>
        <main className="h-[calc(100vh-5rem)] flex flex-col justify-center px-4">
          <m.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col px-8 py-10 max-w-96 min-w-[343px] w-full bg-stone-950 bg-opacity-80 mx-auto rounded-md"
          >
            <h1 className="text-3xl font-semibold font-ibm-condensed">
              Sign In
            </h1>
            <div className="my-6">
              <input
                type="text"
                placeholder="Email address"
                className="w-full px-3 py-2 text-white bg-gray-500 rounded bg-opacity-60 focus"
                onChange={onEmailChange}
              />
              {message && <span>{message}</span>}
            </div>
            <button
              className="py-2 transition bg-red-600 rounded-md hover:bg-opacity-90 focus focus-visible:bg-transparent"
              onClick={onSignInClick}
            >
              {isLoading ? (
                <>
                  Signing in<span className="animate-pulse">...</span>
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </m.div>
        </main>
      </div>
    </>
  );
};

export default Login;
