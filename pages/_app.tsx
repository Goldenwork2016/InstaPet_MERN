import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import Head from 'next/head';
import 'swiper/css';
import { useRouter } from 'next/router';
import { SessionProvider } from 'next-auth/react';
import type { Session } from 'next-auth';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AppContextProvider from '../context/appContext';

export default function AppApp({
  Component,
  pageProps: { session, ...pageProps },
}: AppProps<{ session: Session }>) {
  const excludeLayout = ['/login', '/register', '/confirm', '/error'];
  const { pathname } = useRouter();
  const showLayout = !excludeLayout.includes(pathname);

  return (
    <>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
      </Head>
      <SessionProvider session={session}>
        <ToastContainer />
        {showLayout ? (
          <AppContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </AppContextProvider>
        ) : (
          <Component {...pageProps} />
        )}
      </SessionProvider>
    </>
  );
}
