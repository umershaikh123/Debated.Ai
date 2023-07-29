import { Icon } from 'components/Icon';
import { tokens } from 'components/ThemeProvider/theme';
import { Transition } from 'components/Transition';
import { useId, useRef, useState } from 'react';
import { classes, cssProps, msToNum } from 'utils/style';
import styles from './SwitchToggle.module.css';

export const SwitchToggle = ({ id, label, on, className, style, error, onChange, ...rest }) => {
  const [focused, setFocused] = useState(false);
  const generatedId = useId();
  const errorRef = useRef();
  const switchId = id || `${generatedId}switch`;
  const labelId = `${switchId}-label`;
  const errorId = `${switchId}-error`;

  const handleBlur = () => {
    setFocused(false);
  };

  return (
    <div
      className={classes(styles.container, className)}
      data-error={!!error}
      style={style}
      {...rest}
    >
      <div className={styles.content}>
        <label
          className={styles.label}
          data-focused={focused}
          data-filled={!!on}
          id={labelId}
          htmlFor={switchId}
        >
          {label}
        </label>
        <div
          className={classes(styles.switch, on ? styles.on : styles.off)}
          id={switchId}
          aria-labelledby={labelId}
          aria-describedby={error ? errorId : undefined}
          onFocus={() => setFocused(true)}
          onBlur={handleBlur}
          onClick={onChange}
          role="checkbox"
          tabIndex={0}
          aria-checked={on}
        >
          <div className={styles.toggle} />
        </div>
        <div className={styles.underline} data-focused={focused} />
      </div>
      <Transition unmount in={error} timeout={msToNum(tokens.base.durationM)}>
        {visible => (
          <div
            className={styles.error}
            data-visible={visible}
            id={errorId}
            role="alert"
            style={cssProps({
              height: visible ? errorRef.current?.getBoundingClientRect().height : 0,
            })}
          >
            <div className={styles.errorMessage} ref={errorRef}>
              <Icon icon="error" />
              {error}
            </div>
          </div>
        )}
      </Transition>
    </div>
  );
};
