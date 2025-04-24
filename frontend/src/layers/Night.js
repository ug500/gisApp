import { useEffect } from 'react';

const Night = ({ active }) => {
  useEffect(() => {
    const root = document.getElementById('root');
    if (!root) return;

    if (active) {
      root.style.filter = 'brightness(40%)';
    } else {
      root.style.filter = '';
    }

    return () => {
      root.style.filter = '';
    };
  }, [active]);

  return null;
};

export default Night;
