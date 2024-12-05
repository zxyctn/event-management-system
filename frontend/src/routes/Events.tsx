import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, User as UserIcon, Users } from 'lucide-react';

import CreateEvent from '../components/CreateEvent';
import {
  dateToString,
  joinEvent,
  leaveEvent,
  deleteEvent,
  getUser,
  getEvents,
} from '../utils/utils';
import type { Event, User } from '../types';

const Events = () => {
  let ws: WebSocket | null = null;
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    Promise.all([
      getUser().then((data) => setUser(data)),
      getEvents().then((data) => setEvents(data)),
    ]);
  }, []);

  useEffect(() => {
    ws = new WebSocket('ws://localhost:8000/ws/events/');
    ws.onopen = () => console.log('Connected to global events');
    ws.onclose = () => console.log('Disconnected from global events');

    return () => {
      ws?.close();
    };
  }, []);

  useEffect(() => {
    if (!ws) return;

    ws.onmessage = (e) => {
      console.log(e);
      const data = JSON.parse(e.data);
      if (data.type === 'event_update') {
        const event = data.event;
        if (
          event.type === 'joiner_created' ||
          event.type === 'joiner_deleted'
        ) {
          const { event_id: eventId, joiners } = event.data;

          setEvents((prevEvents) => {
            const updatedEvents = prevEvents.map((prevEvent) => {
              if (prevEvent.id === eventId) {
                return {
                  ...prevEvent,
                  joiners: joiners,
                };
              }
              return prevEvent;
            });
            return updatedEvents;
          });
        } else if (event.type === 'deleted') {
          setEvents((prevEvents) => {
            const updatedEvents = prevEvents.filter(
              (prevEvent) => prevEvent.id !== event.data.id
            );
            return updatedEvents;
          });
        } else if (event.type === 'created') {
          setEvents((prevEvents) => [...prevEvents, event.data]);
        }
      }
    };
  }, [ws]);

  const logOut = async () => {
    const response = await fetch('http://localhost:8000/logout/', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refresh: localStorage.getItem('refresh_token'),
      }),
    });

    if (response.ok) {
      toast.success('Logged out successfully!');
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      navigate('/login');
    } else {
      toast.error('Failed to log out...');
    }
  };

  return (
    <div className='w-full h-full flex justify-center p-8 py-4'>
      <div className='flex flex-col gap-4 w-full'>
        <div className='flex w-full justify-start pb-4'>
          <button className='btn btn-outline w-max' onClick={logOut}>
            Log out
          </button>
        </div>
        <h1 className='text-3xl font-semibold'>Events</h1>
        <hr className='opacity-10' />
        <CreateEvent />
        {events.length === 0 && (
          <div className='py-8 px-4 flex text-neutral-content justify-center bg-neutral rounded-lg italic'>
            There are no events yet...
          </div>
        )}
        {events.map((event) => (
          <div
            key={event.id}
            className='bg-neutral text-neutral-content rounded-xl p-6'
          >
            <div className='flex flex-col gap-4'>
              <div className='flex justify-between gap-4 items-center'>
                <div className='flex gap-2 items-center text-3xl'>
                  <div
                    className='font-semibold cursor-pointer'
                    title='Title'
                    onClick={() => navigate(`/${event.id}`)}
                  >
                    {event.title}
                  </div>
                </div>
                <div className='flex gap-2 items-center text-xl'>
                  <span title='Organizer'>
                    <UserIcon size={24} />
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
        ))}
      </div>
    </div>
  );
};

export default Events;
