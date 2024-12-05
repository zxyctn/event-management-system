export type User = {
  id: number;
  username: string;
};

export type Event = {
  id: number;
  title: string;
  organizer: User;
  date_and_time: Date;
  duration: number;
  location: string;
  joiners: User[];
  created_at?: Date;
};
