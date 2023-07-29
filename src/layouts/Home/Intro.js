import ArrowDown from 'assets/arrow-down.svg';
import { DecoderText } from 'components/DecoderText';
import { Heading } from 'components/Heading';
import { Section } from 'components/Section';
import { useTheme } from 'components/ThemeProvider';
import { tokens } from 'components/ThemeProvider/theme';
import { Transition } from 'components/Transition';
import { AnimatePresence } from 'framer-motion';
import { useInterval, usePrevious } from 'hooks';
import dynamic from 'next/dynamic';
import { Fragment, useEffect, useState } from 'react';
import { cssProps } from 'utils/style';
import styles from './Intro.module.css';

const RobotsModel = dynamic(() => import('layouts/Home/RobotsModel').then(mod => mod.RobotsModel));

export function Intro({ id, sectionRef, introSentences, ...rest }) {
  const theme = useTheme();
  const [disciplineIndex, setDisciplineIndex] = useState(0);
  const prevTheme = usePrevious(theme);
  const currentSentence = introSentences.find((item, index) => index === disciplineIndex);
  const titleId = `${id}-title`;

  useInterval(
    () => {
      const index = (disciplineIndex + 1) % introSentences.length;
      setDisciplineIndex(index);
    },
    5000,
    theme.themeId
  );

  useEffect(() => {
    if (prevTheme && prevTheme.themeId !== theme.themeId) {
      setDisciplineIndex(0);
    }
  }, [theme.themeId, prevTheme]);

  return (
    <>
      <Section
        className={styles.intro}
        as="section"
        ref={sectionRef}
        id={id}
        aria-labelledby={titleId}
        tabIndex={-1}
        {...rest}
      >
        <Transition in timeout={3000}>
          {(visible, status) => (
            <Fragment>
              <RobotsModel />
              <header className={styles.text}>
                <h1 className={styles.name} data-visible={visible} id={titleId}>
                  <DecoderText text="Welcome to," delay={300} />
                </h1>
                <Heading level={0} as="h1" className={styles.title}>
                  <span aria-hidden className={styles.row}>
                    <span className={styles.wordTitle} data-status={status}>
                      Debated.AI
                    </span>
                    <span className={styles.line} data-status={status} />
                  </span>
                </Heading>
                <Heading level={1} as="h2" className={styles.title}>
                  <div className={styles.row} component="span">
                    <AnimatePresence>
                      {introSentences.map(item => (
                        <Transition
                          unmount
                          in={item === currentSentence}
                          timeout={{ enter: 3000, exit: 2000 }}
                          key={item}
                        >
                          {(visible, status) => (
                            <span
                              aria-hidden
                              className={styles.word}
                              data-status={status}
                              data-plus={true}
                              style={cssProps({ delay: tokens.base.durationS })}
                            >
                              {item}
                            </span>
                          )}
                        </Transition>
                      ))}
                    </AnimatePresence>
                  </div>
                </Heading>
              </header>
            </Fragment>
          )}
        </Transition>
      </Section>
    </>
  );
}
