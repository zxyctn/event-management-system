import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Clock, MapPin, User, Users } from 'lucide-react';

import api from '../utils/axios';
import { Event as EventType } from '../types';
import {
  dateToString,
  joinEvent,
  leaveEvent,
  deleteEvent,
  getUser,
} from '../utils/utils';

const Event = () => {
  const id = useParams<{ id: string }>().id || '';
  const navigate = useNavigate();
  const [user, setUser] = useState<{ id: number; username: string } | null>(
    null
  );
  const [event, setEvent] = useState<EventType>({
    id: 0,
    title: '',
    date_and_time: new Date(),
    duration: 0,
    location: '',
    organizer: {
      id: 0,
      username: '',
    },
    joiners: [],
  });

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}/`);

        if (response.status !== 200) {
          console.error(response.data);
          return;
        }

        setEvent(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    Promise.all([getUser().then((data) => setUser(data)), fetchEvent()]);
  }, [id]);

  return (
    <div className='flex flex-col py-4 gap-12'>
      <button
        className='btn btn-ghost text-xl flex items-center gap-2 w-max'
        onClick={() => navigate('/')}
      >
        <ArrowLeft size={24} />
        <span>Back</span>
      </button>
      <div className='px-10'>
        <div className='flex flex-col gap-8'>
          <div className='flex justify-between gap-4 items-center'>
            <div className='flex gap-2 items-center text-3xl'>
              <h1 className='font-semibold' title='Title'>
                {event.title}
              </h1>
            </div>
            <div className='flex gap-2 items-center text-xl'>
              <span title='Organizer'>
                <User size={24} />
              </span>
              <h1 className=''>{event.organizer.username}</h1>
            </div>
          </div>
          <div className='flex gap-x-12 flex-wrap gap-y-2'>
            <div className='flex gap-2 items-center text-xl'>
              <span title='Date and time'>
                <Calendar size={24} />
              </span>
              <h1 className=''>{dateToString(event.date_and_time)}</h1>
            </div>
            <div className='flex gap-2 items-center text-xl'>
              <span title='Duration'>
                <Clock size={24} />
              </span>
              <h1 className=''>{event.duration} mins</h1>
            </div>
            <div className='flex gap-2 items-center text-xl'>
              <span title='Location'>
                <MapPin size={24} />
              </span>
              <h1 className=''>{event.location}</h1>
            </div>
          </div>
          <div className='flex gap-2 items-center text-xl'>
            <span title='Joiners'>
              <Users size={24} />
            </span>
            {event.joiners.length > 0 ? (
              <div className='flex gap-2 items-center overflow-auto'>
                {event.joiners.map((joiner) => (
                  <div
                    key={`event-${event.id}-joiner-${joiner.id}`}
                    className='p-1 text-sm px-3 bg-primary rounded-lg text-primary-content font-semibold'
                  >
                    {joiner.username}
                  </div>
                ))}
              </div>
            ) : (
              <div>No joiners yet...</div>
            )}
          </div>
        </div>
        <div className='flex items-center justify-end gap-2'>
          {event.organizer.id !== user?.id ? (
            event.joiners.some((joiner) => joiner.id === user?.id) ? (
              <button
                className='btn btn-secondary'
                onClick={() => leaveEvent(`${event.id}`)}
              >
                Leave event
              </button>
            ) : (
              <button
                className='btn btn-primary'
                onClick={() => joinEvent(`${event.id}`)}
              >
                Join event
              </button>
            )
          ) : (
            <button
              className='btn btn-error'
              onClick={() => deleteEvent(`${event.id}`)}
            >
              Cancel event
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Event;
