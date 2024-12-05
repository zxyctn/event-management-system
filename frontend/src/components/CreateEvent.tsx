import { useState } from 'react';
import api from '../utils/axios';
import toast from 'react-hot-toast';

const CreateEvent = () => {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [duration, setDuration] = useState(0);
  const [location, setLocation] = useState('');

  const resetFields = () => {
    setTitle('');
    setDate('');
    setDuration(0);
    setLocation('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await api.post('/events/', {
        title,
        date_and_time: date,
        duration,
        location,
      });

      const data = response.data;
      if (response.status !== 201) {
        console.error(data);
        toast.error('Failed to create event');
        return;
      }

      resetFields();
      toast.success('Event created successfully!');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className='flex w-full h-max'>
      <div
        id='create-event'
        tabIndex={0}
        className='collapse collapse-arrow border-base-300 bg-base-200 border rounded-lg'
      >
        <input type='checkbox' className='peer' />
        <div className='collapse-title text-xl font-medium'>
          <div className='flex gap-2 items-center'>
            <span className='text-nowrap text-lg font-semibold'>
              Create event
            </span>
          </div>
        </div>
        <div className='collapse-content'>
          <form
            className='flex flex-wrap gap-2 items-center'
            onSubmit={handleSubmit}
          >
            <div className='flex grow w-full'>
              <label className='form-control w-full'>
                <div className='label'>
                  <span className='label-text'>Title</span>
                </div>
                <input
                  type='text'
                  placeholder='Title'
                  value={title}
                  name='title'
                  onChange={(e) => setTitle(e.target.value)}
                  className='input input-bordered w-full'
                  required
                />
              </label>
            </div>
            <div className='grid md:grid-cols-3 gap-8 items-center w-full'>
              <label className='form-control w-full'>
                <div className='label'>
                  <span className='label-text'>Date and time</span>
                </div>
                <input
                  type='datetime-local'
                  value={date}
                  name='date'
                  onChange={(e) => setDate(e.target.value)}
                  className='input input-bordered w-full'
                  required
                />
              </label>
              <label className='form-control w-full'>
                <div className='label'>
                  <span className='label-text'>Duration (in mins)</span>
                </div>
                <input
                  type='number'
                  value={duration}
                  name='duration'
                  onChange={(e) => setDuration(+e.target.value)}
                  className='input input-bordered w-full'
                  required
                />
              </label>
              <label className='form-control w-full'>
                <div className='label'>
                  <span className='label-text'>Location</span>
                </div>
                <input
                  type='text'
                  value={location}
                  name='location'
                  placeholder='Location'
                  onChange={(e) => setLocation(e.target.value)}
                  className='input input-bordered w-full'
                  required
                />
              </label>
            </div>

            <div className='w-full flex gap-4 justify-end mt-6'>
              <button
                className='btn btn-ghost'
                type='reset'
                onClick={resetFields}
              >
                Cancel
              </button>
              <button className='btn btn-primary w-32' type='submit'>
                Submit
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
