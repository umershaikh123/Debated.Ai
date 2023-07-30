import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { spring } from 'popmotion';
import { useFocused, useOnClickOutside } from './hooks';
import styles from './VoiceDropdown.module.css';
import { classes } from 'utils/style';

const VoiceDropdown = ({ items, className, onVoiceSelected }) => {
  const noneOption = {
    voice_id: '',
    name: 'None',
  };

  const [clicked, setClicked] = useState(false);
  const [title, setTitle] = useState(noneOption.name);
  const [titleHovered, setTitleHovered] = useState(false);
  const [curIndex, setCurIndex] = useState(-1);

  const dropdown = useRef(null);
  const dropdownContainer = useRef(null);
  const dropdownFocused = useFocused(dropdown);

  useOnClickOutside(dropdownContainer, () => setClicked(false));

  useEffect(() => {
    document.addEventListener('keypress', onKeypress);
    document.addEventListener('keydown', onKeydown);
    return () => {
      document.removeEventListener('keypress', onKeypress);
      document.removeEventListener('keydown', onKeydown);
    };
  }, [curIndex, titleHovered, clicked, dropdownFocused]);

  const onKeypress = e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      if (dropdownFocused || titleHovered) {
        setClicked(!clicked);
      }
      if (clicked) {
        setTitle(items[curIndex].name);
        onVoiceSelected(items[curIndex].voice_id);
        setClicked(false);
      }
    }
  };

  const onKeydown = e => {
    const isDownKey = e.keyCode === 40;
    const isUpArrow = e.keyCode === 38;

    if (isDownKey) {
      e.preventDefault();
      setCurIndex((curIndex + 1) % items.length);
    } else if (isUpArrow) {
      e.preventDefault();
      setCurIndex(curIndex - 1 > -1 ? curIndex - 1 : items.length - 1);
    }
  };

  const options = [noneOption, ...items].map((item, index) => (
    <motion.li
      key={`option-${item.voice_id}`}
      className={`${styles.option} ${index === items.length ? styles.noBorder : ''}`}
      whileTap={{ opacity: 1 }}
      onHoverStart={() => setCurIndex(index)}
      onHoverEnd={() => setCurIndex(-1)}
      onClick={() => {
        setClicked(false);
        setTitle(item.name);
        onVoiceSelected(item.voice_id);
      }}
    >
      {item.name}
    </motion.li>
  ));

  return (
    <div className={classes(styles.dropdownContainer, className)} ref={dropdownContainer}>
      <motion.button
        className={styles.titleContainer}
        ref={dropdown}
        type="button"
        onClick={() => setClicked(!clicked)}
        onHoverStart={() => setTitleHovered(true)}
        onHoverEnd={() => setTitleHovered(false)}
      >
        <div className={styles.title}>{title}</div>
        <span className={styles.arrowSvgContainer}>
          <motion.svg
            className={styles.arrowSvg}
            animate={clicked ? { rotateZ: 180 } : { rotateZ: 0 }}
            viewBox="0 0 13 7"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0.86543 0.373845C0.55918 0.680095 0.55918 1.17385 0.86543 1.4801L6.05918 6.67385C6.30293 6.9176 6.69668 6.9176 6.94043 6.67385L12.1342 1.4801C12.4404 1.17385 12.4404 0.680095 12.1342 0.373845C11.8279 0.067595 11.3342 0.067595 11.0279 0.373845L6.49668 4.89885L1.96543 0.367595C1.66543 0.0675955 1.16543 0.067595 0.86543 0.373845Z"
              fill="currentColor"
              fillOpacity="0.54"
            />
          </motion.svg>
        </span>
      </motion.button>
      <div className={styles.optionsOuterContainer}>
        <motion.ul
          className={styles.optionsContainer}
          initial={{ height: 0 }}
          animate={
            clicked
              ? {
                  height: 'auto',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.25)',
                }
              : {
                  height: 0,
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                  transition: { type: spring },
                }
          }
        >
          {options}
        </motion.ul>
      </div>
    </div>
  );
};

export default VoiceDropdown;
