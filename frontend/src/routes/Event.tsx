import { useParams } from 'react-router-dom';

const Event = () => {
  const id = useParams<{ id: string }>().id || '';

  return <div>Event: {id}</div>;
};

export default Event;
