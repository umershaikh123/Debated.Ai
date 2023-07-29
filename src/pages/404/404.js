import notFoundGif from 'assets/desert.gif';
import { Button } from 'components/Button';
import { DecoderText } from 'components/DecoderText';
import { Heading } from 'components/Heading';
import { Meta } from 'components/Meta';
import { Text } from 'components/Text';
import { Transition } from 'components/Transition';
import { Fragment } from 'react';
import styles from './404.module.css';
import { Image } from 'components/Image';

export function Page404() {
  return (
    <section className={styles.page}>
      <Meta title="404 Not Found" description="404 page not found. This page doesn't exist" />
      <Transition in>
        {visible => (
          <Fragment>
            <div className={styles.details}>
              <div className={styles.text}>
                <Heading className={styles.title} data-visible={visible} level={0} weight="bold">
                  404
                </Heading>
                <Heading
                  aria-hidden
                  className={styles.subheading}
                  data-visible={visible}
                  as="h2"
                  level={3}
                >
                  <DecoderText text="Error: Redacted" start={visible} delay={300} />
                </Heading>
                <Text className={styles.description} data-visible={visible} as="p">
                  Are you lost out there, poor human?
                </Text>
                <Text className={styles.description} data-visible={visible} as="p">
                  From stardust to sentience, you might very well be a cosmic miracle... yet somehow
                  you excel at fucking up simple URLs, having pizza topping feuds, and living on the
                  brink of a nuclear catastrophy. Marvelous!
                </Text>
                <Button
                  secondary
                  iconHoverShift
                  className={styles.button}
                  data-visible={visible}
                  href="/"
                  icon="chevronRight"
                >
                  Back to homepage
                </Button>
              </div>
            </div>

            <div className={styles.videoContainer} data-visible={visible}>
              <Image
                src={notFoundGif}
                alt="404-notfound"
                placeholder={notFoundGif}
                className={styles.video}
                height={600}
              />
            </div>
          </Fragment>
        )}
      </Transition>
    </section>
  );
}
