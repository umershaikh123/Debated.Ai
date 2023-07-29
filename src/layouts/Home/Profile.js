import profileImg from 'assets/myPhoto.jpeg';
import { Button } from 'components/Button';
import { DecoderText } from 'components/DecoderText';
import { Divider } from 'components/Divider';
import { Heading } from 'components/Heading';
import { Image } from 'components/Image';
import { Section } from 'components/Section';
import { Text } from 'components/Text';
import { Transition } from 'components/Transition';
import { Fragment, useState } from 'react';
import { media } from 'utils/style';
import styles from './Profile.module.css';

function calculateAge(birthday) {
  const ageDifMs = Date.now() - birthday.getTime();
  const ageDate = new Date(ageDifMs);
  return Math.abs(ageDate.getUTCFullYear() - 1970);
}

const ProfileText = ({ visible, titleId }) => (
  <Fragment>
    <Heading className={styles.title} data-visible={visible} level={1} id={titleId}>
      <DecoderText text="Yo!" start={visible} delay={500} />
    </Heading>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      My name is Ahmad Alaziz, I am a <Text>{calculateAge(new Date(2000, 9, 15))}</Text>{' '}
      years old developer from Syria living in Poland. Programming is my passion, and I
      believe it is the closest thing we have to magic in the 21st century. I am
      constantly working on new projects, trying to solve problems that I see around me.
    </Text>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      I am also fascinated by AI and understanding human behaviors and patterns in that
      context. Currently I am taking courses in Computational Neuroscience and
      Neuroinformatics.
    </Text>
    <Text className={styles.description} data-visible={visible} size="l" as="p">
      I believe in a future where AI helps us understand ourselves better and elevates us
      as a species rather than prey on our human vulnerabilities for profit like they
      mostly do now.
    </Text>
  </Fragment>
);

export const Profile = ({ id, visible, sectionRef }) => {
  const [focused, setFocused] = useState(false);
  const titleId = `${id}-title`;

  return (
    <Section
      className={styles.profile}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      as="section"
      id={id}
      ref={sectionRef}
      aria-labelledby={titleId}
      tabIndex={-1}
    >
      <Transition in={visible || focused} timeout={0}>
        {visible => (
          <div className={styles.content}>
            <div className={styles.column}>
              <ProfileText visible={visible} titleId={titleId} />
              <Button
                secondary
                className={styles.button}
                data-visible={visible}
                href="/contact"
                icon="send"
              >
                Send me a message
              </Button>
            </div>
            <div className={styles.column}>
              <div className={styles.tag} aria-hidden>
                <Divider
                  notchWidth="64px"
                  notchHeight="8px"
                  collapsed={!visible}
                  collapseDelay={1000}
                />
                <div className={styles.tagText} data-visible={visible}>
                  About Me
                </div>
              </div>
              <div className={styles.image}>
                <Image
                  reveal
                  delay={100}
                  placeholder={profileImg}
                  srcSet={[profileImg]}
                  sizes={`(max-width: ${media.mobile}px) 100vw, 480px`}
                  alt="Me"
                />
              </div>
            </div>
          </div>
        )}
      </Transition>
    </Section>
  );
};
