import { Footer } from 'components/Footer';
import { Meta } from 'components/Meta';
import { Intro } from 'layouts/Home/Intro';
import { useRef } from 'react';
import styles from './Home.module.css';

const introSentences = [
  'Your AI-Powered Debating Platform',
  'Where Every Perspective Matters',
  'Know All Sides Of Any Story',
];

export const Home = () => {
  const intro = useRef();

  return (
    <>
      <div className={styles.home}>
        <Meta
          title="AI Debate Platform"
          prefix="Debated.AI"
          description="Debated — AI Debate Platform"
        />
        <Intro id="intro" sectionRef={intro} introSentences={introSentences} />
        <Footer />
      </div>
    </>
  );
};
