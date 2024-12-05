# Make sure to install all the requirements before starting the server
# pip install -r requirements.txt

# Make sure to make migrations before starting the server
# python manage.py makemigrations api
# python manage.py makemigrations

# Make sure to migrate before starting the server
# python manage.py migrate

# Make sure to collect static files for API to have proper styles
# python manage.py collectstatic --noinput

# Start Redis server
# redis-server

# Starts Django server and serves API and websockets
uvicorn backend.asgi:application --host localhost