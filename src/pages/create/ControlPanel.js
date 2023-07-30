import { DecoderText, Divider, Heading, Section, Text, Transition, tokens } from 'components';
import styles from './ControlPanel.module.css';
import boltAnimation from 'assets/lottie/bolt.json';
import controlsAnimation from 'assets/lottie/controls.json';
import Lottie from 'lottie-react';
import { ControlPanelMachine, panelStates } from './MachineStates';
import { QuickStartForm } from './QuickStartForm';
import { useMachine } from '@xstate/react';
import { cssProps, msToNum, numToMs } from 'utils/style';
import { CustomForm } from './CustomForm';

const ModeButton = ({ animationData, title, description, onClick }) => (
  <button onClick={onClick} className={styles.debateModeContainer}>
    <div className={styles.animation}>
      <Lottie animationData={animationData} />
    </div>
    <Text size={'m'} weight={'bold'} className={styles.textTitle}>
      {title}
    </Text>
    <Text size={'xs'} align="center">
      {description}
    </Text>
  </button>
);

export const ControlPanel = ({ startChat }) => {
  const [state, send] = useMachine(ControlPanelMachine);
  const initDelay = tokens.base.durationS;

  const handleModeClick = selectedMode => send(`SELECT_${selectedMode.toUpperCase()}`);
  const handleBackClick = () => send('BACK');

  const isMachineState = stateName => state.matches(stateName);

  return (
    <Section className={styles.contact}>
      <Transition unmount in timeout={1600}>
        {(_visible, status) => (
          <>
            {isMachineState(panelStates.IDLE) && (
              <>
                <Divider
                  className={styles.divider}
                  data-status={status}
                  style={getDelay(tokens.base.durationXS, initDelay, 0.4)}
                />
                <Heading className={styles.title} data-status={status} level={4} as="h2">
                  <DecoderText
                    text="Debate Mode"
                    start={status !== 'exited'}
                    delay={300}
                    className={styles.headerText}
                  />
                </Heading>
                <ModeButton
                  animationData={boltAnimation}
                  title="Quick Start Mode"
                  description="Simply enter the topic of debate and watch as the AIs battle"
                  onClick={() => handleModeClick(panelStates.QUICK_START)}
                />
                <ModeButton
                  animationData={controlsAnimation}
                  title="Custom Mode"
                  description="Have complete control over the AI stances, names, and behavior"
                  onClick={() => handleModeClick(panelStates.CUSTOM)}
                />
              </>
            )}
            {isMachineState(panelStates.QUICK_START) && (
              <QuickStartForm status={status} onBackClick={handleBackClick} startChat={startChat} />
            )}
            {isMachineState(panelStates.CUSTOM) && (
              <CustomForm status={status} onBackClick={handleBackClick} startChat={startChat} />
            )}
          </>
        )}
      </Transition>
    </Section>
  );
};

export function getDelay(delayMs, offset = numToMs(0), multiplier = 1) {
  const numDelay = msToNum(delayMs) * multiplier;
  return cssProps({ delay: numToMs((msToNum(offset) + numDelay).toFixed(0)) });
}
