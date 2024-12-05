# Make sure to collect static files for API to have proper styles
# python manage.py collectstatic --noinput

# Start Redis server
# redis-server

# Starts Django server and serves API and websockets
uvicorn backend.asgi:application --host localhost