import { useState } from 'react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className='w-full h-full flex items-center justify-center'>
      <div className='flex flex-col w-max items-center gap-8'>
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
                onChange={(e) => setUsername(e.target.value)}
                className='input input-bordered w-full max-w-xs'
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
                onChange={(e) => setPassword(e.target.value)}
                className='input input-bordered w-full max-w-xs'
              />
            </label>
          </div>

          <button className='btn btn-primary' type='submit'>
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
