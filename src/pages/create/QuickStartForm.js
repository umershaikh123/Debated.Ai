import { Input } from 'components/Input';
import styles from './ControlPanel.module.css';
import loadingAnimation from 'assets/lottie/brain.json';
import { Text } from 'components/Text';
import { Heading } from 'components/Heading';
import { Button } from 'components/Button';
import { getStances, getAvatarsAndGenders } from 'pages/api/chat/functions';
import { getDelay } from './ControlPanel';
import { SegmentedControl, SegmentedControlOption } from 'components/SegmentedControl';
import { DecoderText } from 'components/DecoderText';
import Lottie from 'lottie-react';
import { Divider } from 'components/Divider';
import { useFormInput } from 'hooks';
import { useState } from 'react';
import { tokens } from 'components';

const Loading = ({ status }) => (
  <div className={styles.loading}>
    <Lottie animationData={loadingAnimation} />
    <DecoderText text="Scanning Brains..." start={status !== 'exited'} delay={300} />
  </div>
);

const FormInput = ({ status, delay, label, ...props }) => (
  <Input
    required
    className={styles.input}
    data-status={status}
    style={getDelay(tokens.base.durationXS, delay)}
    autoComplete="off"
    label={label}
    {...props}
  />
);

export const QuickStartForm = ({ status, delay, onBackClick, startChat }) => {
  const debateTopic = useFormInput('');
  const messagesCount = useFormInput(2);

  const [loading, setLoading] = useState(false);

  const [view, setView] = useState('form');
  const [stances, setStances] = useState([]);
  const [isNameRandomlyGenerated, setIsNameRandomlyGenerated] = useState(false);

  const handleGenerateDebates = async event => {
    event.preventDefault();

    // Check if values are valid
    if (!debateTopic.value || !messagesCount.value) {
      // Show error or alert here

      return;
    }

    setLoading(true);
    const stances = await getStances(debateTopic.value, isNameRandomlyGenerated);
    setStances(stances);
    setView('stances');
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  const handleStartDebate = async debate => {
    setLoading(true);
    const names = [debate[0], debate[2]];
    const avatarsAndGenders = await getAvatarsAndGenders(names);

    // Extract avatars and genders from avatarsAndGenders
    const avatars = avatarsAndGenders.map(result => result.avatarUrl);
    const genders = avatarsAndGenders.map(result => result.gender);

    setLoading(false);
    setView('debates');
    await startChat({
      names: names,
      stances: [debate[1], debate[3]],
      personalities: [],
      messagesCount: messagesCount.value,
      avatars: avatars,
    });
  };

  const handleTryAgain = async () => {
    setView('form');
    setStances([]);
  };

  const handleNameOptionChange = index => {
    setIsNameRandomlyGenerated(!!index);
  };

  return (
    <>
      <Divider
        className={styles.divider}
        data-status={status}
        style={getDelay(tokens.base.durationXS, '300ms', 0.4)}
      />
      <form onSubmit={handleGenerateDebates} className={styles.form} method="post">
        <Heading
          className={styles.title}
          data-status={status}
          level={3}
          as="h1"
          style={getDelay(tokens.base.durationXS, delay, 0.3)}
        >
          <div className={styles.header}>
            <Button
              data-status={status}
              secondary
              onClick={onBackClick}
              icon={'arrowLeft'}
              iconHoverShift
              type="button"
              className={styles.backBtn}
            >
              Back
            </Button>
            <DecoderText
              text="Quick Start"
              start={status !== 'exited'}
              delay={300}
              className={styles.headerText}
            />
          </div>
        </Heading>
        {loading && <Loading status={status} />}
        {view === 'form' && !loading && (
          <>
            <FormInput
              status={status}
              delay={delay}
              type="text"
              label="Debate Topic"
              maxLength={512}
              {...debateTopic}
            />
            <FormInput
              status={status}
              delay={delay}
              label="Number of Messages per AI"
              type="number"
              min={2}
              max={30}
              {...messagesCount}
            />

            <div className={styles.nameSelector}>
              <SegmentedControl
                currentIndex={+isNameRandomlyGenerated}
                onChange={handleNameOptionChange}
              >
                <SegmentedControlOption>Ai Generated Names</SegmentedControlOption>
                <SegmentedControlOption>Randomly Generated Name</SegmentedControlOption>
              </SegmentedControl>
            </div>

            <Button className={styles.button} data-status={status} loading={loading} type="submit">
              Generate Potiential Debates
            </Button>
          </>
        )}
      </form>
      {view === 'stances' && !loading && (
        <div className={styles.form}>
          {stances.map((debate, index) => (
            <button
              key={index}
              onClick={() => handleStartDebate(debate)}
              className={styles.debateChoice}
            >
              <Text size={'xs'} align="start">
                {debate[0]}
              </Text>
              <Text size={'xs'} weight="bold" align="start">
                {debate[1]}
              </Text>
              <Text size={'m'} weight="bold" align="center" className={styles.verses}>
                vs
              </Text>
              <Text size={'xs'} align="end">
                {debate[2]}
              </Text>
              <Text size={'xs'} align="end" weight="bold">
                {debate[3]}
              </Text>
            </button>
          ))}
          <Button secondary onClick={handleTryAgain} className={styles.tryAgainBtn}>
            Try Again
          </Button>
        </div>
      )}
    </>
  );
};
