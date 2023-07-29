import { forwardRef } from 'react';
import { classes } from 'utils/style';
import styles from './Monogram.module.css';
import Logo from 'assets/logo/logo.svg';

export const Monogram = forwardRef(({ className, ...props }, ref) => {
  return (
    <Logo
      aria-hidden
      viewBox="0 0 201 190"
      preserveAspectRatio="xMidYMid meet"
      className={classes(styles.monogram, className)}
      ref={ref}
      {...props}
    />
  );
});
