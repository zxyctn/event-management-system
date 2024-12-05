import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SignUp = () => {
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('access_token');

    if (token) {
      navigate('/');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:8000/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          email,
          password,
          password2,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        Object.keys(data).forEach((key) => {
          data[key].forEach((message: string) => {
            toast.error(() => (
              <div className='w-[300px]'>
                <div className='text-xs'>
                  Encountered an error in <strong>{key}</strong> field:
                  <hr className='border border-dashed my-1' />
                  <div>{message}</div>
                </div>
              </div>
            ));
          });
        });
      }

      const { access, refresh, user } = data;
      localStorage.setItem('access_token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('username', user.username);
      localStorage.setItem('email', user.email);

      navigate('/');
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
        <h1 className='text-5xl font-bold'>Sign up</h1>
        <div className='grid gap-4'>
          <div className=''>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Email</span>
              </div>
              <input
                type='text'
                placeholder='Email'
                value={email}
                name='email'
                onChange={(e) => setEmail(e.target.value)}
                className='input input-bordered w-full max-w-xs'
                required
              />
            </label>
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
                minLength={8}
                onChange={(e) => setPassword(e.target.value)}
                className='input input-bordered w-full max-w-xs'
                required
              />
            </label>
            <label className='form-control w-full max-w-xs'>
              <div className='label'>
                <span className='label-text'>Repeat password</span>
              </div>
              <input
                type='password'
                placeholder='Password'
                value={password2}
                name='password2'
                minLength={8}
                onChange={(e) => setPassword2(e.target.value)}
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
        Already have an account? Log in{' '}
        <button onClick={() => navigate('/login')} className='link text-xs'>
          here.
        </button>
      </span>
    </div>
  );
};

export default SignUp;
