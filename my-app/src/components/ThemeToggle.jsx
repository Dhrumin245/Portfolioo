import { useEffect, useState } from 'react';

const getInitialTheme = () => {
  if (typeof window === 'undefined') return 'dark';

  const savedTheme = window.localStorage.getItem('theme');
  if (savedTheme === 'light' || savedTheme === 'dark') return savedTheme;

  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
};

function ThemeToggle() {
  const [theme, setTheme] = useState(getInitialTheme);
  const isLight = theme === 'light';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-label={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      aria-pressed={isLight}
      title={`Switch to ${isLight ? 'dark' : 'light'} theme`}
      onClick={() => setTheme(isLight ? 'dark' : 'light')}
    >
      <span className="theme-toggle-icon" aria-hidden="true">
        <span className="theme-toggle-sun"></span>
        <span className="theme-toggle-moon"></span>
      </span>
    </button>
  );
}

export default ThemeToggle;
