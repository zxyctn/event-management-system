import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import api from '../utils/axios';

const Login = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post('/token/', {
        username,
        password,
      });
      const data = response.data;
      if (response.status !== 200) {
        console.error('Failed to login:', response);
        toast.error(data.detail);
      } else {
        toast.success('Logged in successfully!');
        const { access, refresh } = data;
        localStorage.setItem('access_token', access);
        localStorage.setItem('refresh_token', refresh);

        navigate('/');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='w-full h-full flex flex-col items-center justify-center'>
      <form
        onSubmit={handleSubmit}
        className='flex flex-col w-max items-center gap-8'
      >
        <h1 className='text-5xl font-bold'>Login</h1>
        <div className='grid gap-4'>
          <div className=''>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Username</span>
              </div>
              <input
                type='text'
                placeholder='Username'
                value={username}
                name='username'
                onChange={(e) => setUsername(e.target.value)}
                className='input input-bordered w-full max-w-xs'
                required
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Password</span>
              </div>
              <input
                type='password'
                placeholder='Password'
                value={password}
                name='password'
                onChange={(e) => setPassword(e.target.value)}
                className='input input-bordered w-full max-w-xs'
                required
              />
            </label>
          </div>

          <button className='btn btn-primary' type='submit'>
            Submit
          </button>
        </div>
      </form>
      <span className='text-xs mt-8'>
        Don't have an account? Sign up{' '}
        <button onClick={() => navigate('/signup')} className='link text-xs'>
          here.
        </button>
      </span>
    </div>
  );
};

export default Login;
