# Build Commands (make sure to change tag version 1.x etc., and make sure at project root to issue command)
# docker build -t capstone-backend:1.0 .                       
# docker run -p 5000:5000 --rm --name capstone-backend capstone-backend:1.0

# Dockerfile
FROM node:16-alpine

ENV API_AUTH_URL="http://helpmybabies.com:5400/api/v1"
ENV PORT="5000"


# create destination directory
RUN mkdir -p /home/app
COPY . /home/app

# set default dir so that next commands executes in /home/app dir
WORKDIR /home/app

# will execute npm install in /home/app because of WORKDIR
RUN npm install

# expose 5000 on container
EXPOSE 5000

CMD [ "npm", "run", "dev" ]