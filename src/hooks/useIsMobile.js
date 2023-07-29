import { useState, useEffect } from 'react';
import { media } from 'utils/style';

export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIsMobile = () => {
      if (typeof window === 'undefined' || !window.navigator) {
        setIsMobile(false);
        return;
      }

      if (window.innerWidth < media.mobile) {
        setIsMobile(true);
        return;
      }

      const userAgent = window.navigator.userAgent;
      const mobile = /Android|Mobi|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        userAgent
      );
      setIsMobile(mobile);
    };

    checkIsMobile();

    window.addEventListener('resize', checkIsMobile);
    return () => {
      window.removeEventListener('resize', checkIsMobile);
    };
  }, []);

  return isMobile;
};
