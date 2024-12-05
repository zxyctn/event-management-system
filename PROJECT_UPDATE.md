# Project updates

This file contains the details for this project and states what decisions were made and why.

## Tech stack

### Frontend

- For the frontend, I am using React with TypeScript.
- The app has multiple pages, so I am using React Router to handle the routing. 
- For styles, I am using Tailwind CSS and DaisyUI. I chose Tailwind CSS because of my familiarity with it and how efficient it is to get things done quickly. DaisyUI is a plugin for Tailwind CSS that provides a lot of utility classes that I find useful. 
- I am also using Axios to make API requests. The main reason for it was to attach authorization headers to the requests to avoid duplication of code, but also, handle errors, especially when the access token has expired and needs to be refreshed. Axios does all of it seamlessly.

### Backend

- I have chosen Django and Django-REST-Framework for my backend. The main reason is my familiarity with it. Although it took me a while to implement WebSockets, I managed to get it working. 
- I am using Django Channels for WebSockets. 
- I am also using Django REST Framework Simple JWT for authentication. I chose it because it is simple to use and provides all the necessary features for JWT authentication. 
- I am using PostgreSQL as the database and I also have Redis set up for handling WebSockets. 
- As the backend needs PostgreSQL and Redis, I am using Docker Compose to run both services and serve the backend. Docker Compose makes it easy to configure all the services and make sure everything runs platform-independent.

## Decisions

- I have decided to add authentication for this project to make it more of a real-world application. JWT is fairly simple to work with on both front and backend, therefore, I chose it. 
- Adding Docker integration was not something planned. I first did everything with a virtual environment and I was running Redis on WSL. However, configuring DB, Redis and python all at the same time was a bit of a hassle and python projects are relatively simple to configure with Docker, therefore, as the last step, I have added Docker configuration to the project.
- I added Axios just for attaching Authorization headers to the requests. However, error handling helped me a lot and saved me from duplicating code.