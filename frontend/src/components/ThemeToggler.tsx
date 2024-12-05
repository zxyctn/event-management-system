import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

const ThemeToggler = () => {
  const [dark, setDark] = useState(() => {
    let theme = window.localStorage.getItem('theme');
    if (!theme) {
      theme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
      window.localStorage.setItem('theme', theme);
    }
    return theme === 'dark';
  });

  useEffect(() => {
    const theme = dark ? 'dark' : 'light';
    window.localStorage.setItem('theme', theme);

    const html = document.getElementsByTagName('html')[0] as HTMLElement;

    html.classList.add(theme);
    html.classList.remove(!dark ? 'dark' : 'light');

    html.setAttribute('data-theme', theme);
  }, [dark]);

  const handleChange = () => {
    setDark((current) => {
      return !current;
    });
  };

  return (
    <div className='flex justify-center items-center place-self-end btn btn-circle btn-ghost'>
      <label className='swap swap-rotate'>
        <input type='checkbox' checked={dark} onChange={handleChange} />
        <Moon className='swap-on' />
        <Sun className='swap-off' />
      </label>
    </div>
  );
};

export default ThemeToggler;
