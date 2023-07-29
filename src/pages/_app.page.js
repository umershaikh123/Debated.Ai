import 'layouts/App/reset.css';
import 'layouts/App/global.css';

import { Navbar } from 'components/Navbar';
import { ThemeProvider } from 'components/ThemeProvider';
import { tokens } from 'components/ThemeProvider/theme';
import { VisuallyHidden } from 'components/VisuallyHidden';
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion';
import { useFoucFix, useLocalStorage } from 'hooks';
import styles from 'layouts/App/App.module.css';
import { initialState, reducer } from 'layouts/App/reducer';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Fragment, createContext, useEffect, useReducer } from 'react';
import { classes, msToNum } from 'utils/style';
import { ScrollRestore } from '../layouts/App/ScrollRestore';
import { Analytics } from '@vercel/analytics/react';

export const AppContext = createContext({});
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], display: 'swap' });

const App = ({ Component, pageProps }) => {
  const [storedTheme] = useLocalStorage('theme', 'dark');
  const [state, dispatch] = useReducer(reducer, initialState);
  const { route, asPath } = useRouter();
  const canonicalRoute = route === '/' ? '' : `${asPath}`;

  useFoucFix();

  useEffect(() => {
    dispatch({ type: 'setTheme', value: storedTheme || 'dark' });
  }, [storedTheme]);

  return (
    <>
      <AppContext.Provider value={{ ...state, dispatch }}>
        <ThemeProvider themeId={state.theme}>
          <LazyMotion features={domAnimation}>
            <Fragment>
              <Head>
                <link
                  rel="canonical"
                  href={`${process.env.NEXT_PUBLIC_WEBSITE_URL}${canonicalRoute}`}
                />
              </Head>
              <VisuallyHidden showOnFocus as="a" className={styles.skip} href="#MainContent">
                Go to homepage
              </VisuallyHidden>
              <Navbar />
              <main className={classes(styles.app, inter.className)} tabIndex={-1} id="MainContent">
                <AnimatePresence mode="wait">
                  <m.div
                    key={route}
                    className={styles.page}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                      type: 'tween',
                      ease: 'linear',
                      duration: msToNum(tokens.base.durationS) / 1000,
                      delay: 0.1,
                    }}
                  >
                    <ScrollRestore />
                    <Component {...pageProps} />
                  </m.div>
                </AnimatePresence>
              </main>
            </Fragment>
          </LazyMotion>
        </ThemeProvider>
      </AppContext.Provider>
      <Analytics />
    </>
  );
};

export default App;
