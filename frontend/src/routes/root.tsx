import { Outlet, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

import ThemeToggler from '../components/ThemeToggler';

const Root = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (!token) {
      navigate('/login');
    }
  }, []);

  return (
    <div className='w-screen h-screen flex justify-center'>
      <div className='max-w-[1200px] grow'>
        <Toaster />
        <Outlet />
        <div className='fixed top-4 left-4'>
          <ThemeToggler />
        </div>
      </div>
    </div>
  );
};

export default Root;
