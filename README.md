# Event Management System

This is a simple event management system that allows users to create, view, and delete events and lets other users to join or leave these events. The system is built using Django, Django-REST-Framework and React.

## Backend configuration

### Database configuration

The database used in this project is **PostgreSQL**. To configure the database, create a database in PostgreSQL and configure the `settings.py` and `DATABASE_URL` environment variable in the `.env` file.

### Redis configuration

The project uses **Redis** for WebSockets. To configure Redis, install Redis and configure the `settings.py` and `REDIS_URL` environment variable in the `.env` file.

### Installation

1. Clone the repository
2. Install the required packages
3. Make migrations and migrate
4. Run the server

#### Clone the repository

```bash
git clone https://github.com/zxyctn/event-management-system.git
```

#### Install the required packages

```bash
pip install -r requirements.txt
```

#### Make migrations and migrate

```bash
python manage.py makemigrations api
python manage.py makemigrations
python manage.py migrate
```

#### Run the server

This project requires uvicorn to run the server because of the WebSocket implementation. To run the server, run the following command:

```bash
uvicorn backend.asgi:application --host localhost
```

## Frontend configuration

Frontend is built using **React** and **Vite**. Start by installing the required packages and then run the server.

### Installation

1. Install the required packages
2. Run the server

#### Install the required packages

```bash
npm install
```

#### Run the server

```bash
npm run dev
```
