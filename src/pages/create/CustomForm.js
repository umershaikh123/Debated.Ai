import { useState } from 'react';
import { useFormInput } from 'hooks';
import { Input, Text, Heading, Button, DecoderText, Divider } from 'components';
import Lottie from 'lottie-react';
import styles from './ControlPanel.module.css';
import loadingAnimation from 'assets/lottie/brain.json';
import { tokens } from 'components/ThemeProvider/theme';
import { getDelay } from './ControlPanel';
import { SegmentedControl } from 'components';
import { SegmentedControlOption } from 'components';
import { getAvatarsAndGenders } from 'pages/api/chat/functions';

const texts = {
  FIRST: {
    title: 'First AI',
    description: 'Fill in the details for the first AI debater',
    buttonText: 'Next AI',
  },
  SECOND: {
    title: 'Second AI',
    description: 'Fill in the details for the second AI debater',
    buttonText: 'Go to Settings',
  },
  SETTINGS: {
    title: 'General Settings',
    description: '',
    buttonText: 'Generate a Debate',
  },
};

export const CustomForm = ({ status, delay, onBackClick, startChat }) => {
  const initDelay = tokens.base.durationS;

  const ai1Name = useFormInput('');
  const ai1Stance = useFormInput('');
  const ai1Personality = useFormInput('');

  const ai2Name = useFormInput('');
  const ai2Stance = useFormInput('');
  const ai2Personality = useFormInput('');

  const messagesCount = useFormInput(3);

  const [loading, setLoading] = useState(false);
  const [agreementSelectorIndex, setAgreementSelectorIndex] = useState(0);
  const [stage, setStage] = useState('FIRST');

  const stageConfig = texts[stage];

  const handleSubmit = async e => {
    await e.preventDefault();
    if (stage === 'FIRST') {
      setStage('SECOND');
    } else if (stage === 'SECOND') {
      setStage('SETTINGS');
    } else {
      setLoading(true);
      const stances = [ai1Stance.value, ai2Stance.value];
      const names = [ai1Name.value, ai2Name.value];
      const personalities = [ai1Personality.value, ai2Personality.value];
      const avatarsAndGenders = await getAvatarsAndGenders(names);

      // Extract avatars and genders from avatarsAndGenders
      const avatars = avatarsAndGenders.map(result => result.avatarUrl);

      setLoading(false);

      await startChat({
        names: names,
        stances: stances,
        personalities: personalities,
        avatars: avatars,
        messagesCount: messagesCount.value,
        isAgreementOn: +agreementSelectorIndex,
      });
    }
  };

  const renderAIControls = (names, stances, personalities, examples, stage) => {
    const inputs = [names, stances, personalities];

    const elements = inputs.map((input, index) => (
      <Input
        key={index}
        required
        className={styles.input}
        data-status={status}
        style={getDelay(tokens.base.durationXS, delay)}
        autoComplete="off"
        label={['Name', 'Stance', 'Personality'][index]}
        example={examples[index]}
        maxLength={512}
        {...input}
      />
    ));

    return elements;
  };

  const renderSettingControls = messagesCount => {
    return (
      <>
        <Input
          required
          className={styles.input}
          data-status={status}
          style={getDelay(tokens.base.durationXS, delay)}
          autoComplete="off"
          label="Number of messages per AI"
          type="number"
          min={3}
          max={30}
          {...messagesCount}
        />

        <div className={styles.nameSelector}>
          <SegmentedControl
            currentIndex={agreementSelectorIndex}
            onChange={setAgreementSelectorIndex}
          >
            <SegmentedControlOption>Do NOT find common ground</SegmentedControlOption>
            <SegmentedControlOption>Find common ground</SegmentedControlOption>
          </SegmentedControl>
        </div>
      </>
    );
  };

  const stageRenderer = () => {
    switch (stage) {
      case 'FIRST':
        return renderAIControls(
          ai1Name,
          ai1Stance,
          ai1Personality,
          ['Ahmad', 'Barcelona is the best football team', 'Aggressive, Sarcastic'],
          stage
        );
      case 'SECOND':
        return renderAIControls(
          ai2Name,
          ai2Stance,
          ai2Personality,
          ['Bartek', 'Real Madrid is the best football team', 'Passionate, Empathetic'],
          stage
        );
      case 'SETTINGS':
        return renderSettingControls(messagesCount);
      default:
        return null;
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <Divider
        className={styles.divider}
        data-status={status}
        style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
      />
      <Heading
        className={styles.title}
        data-status={status}
        level={3}
        weight="bold"
        as="h1"
        style={getDelay(tokens.base.durationXS, delay, 0.3)}
      >
        <div className={styles.header}>
          <Button
            secondary
            onClick={onBackClick}
            icon={'arrowLeft'}
            type="button"
            iconHoverShift
            className={styles.backBtn}
          >
            Back
          </Button>
          <DecoderText
            text={stageConfig.title}
            start={status !== 'exited'}
            delay={300}
            className={styles.headerText}
          />
        </div>
        <Text size={'s'} weight="regular" secondary className={styles.headerInfo}>
          {stageConfig.description}
        </Text>
      </Heading>
      {loading ? (
        <div className={styles.loading}>
          <Lottie animationData={loadingAnimation} />
          <DecoderText text="Scanning Brains..." start={status !== 'exited'} delay={300} />
        </div>
      ) : (
        stageRenderer()
      )}

      <Button className={styles.button} data-status={status} type="submit">
        {stageConfig.buttonText}
      </Button>
    </form>
  );
};
