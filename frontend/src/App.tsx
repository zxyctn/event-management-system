import { createBrowserRouter, RouterProvider } from 'react-router';

import Root from './routes/root';
import Login from './routes/Login';
import SignUp from './routes/SignUp';
import Events from './routes/Events';
import Event from './routes/Event';

const App = () => {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root />,
      errorElement: <div>Error</div>,
      children: [
        {
          path: 'login',
          element: <Login />,
        },
        {
          path: 'signup',
          element: <SignUp />,
        },
        {
          path: '',
          element: <Events />,
        },
        {
          path: ':id',
          element: <Event />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
