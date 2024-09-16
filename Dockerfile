#Build stage
FROM node:alpine3.20 AS base

WORKDIR /app

<<<<<<< ibixler-da-rework
COPY .env .

COPY package*.json .
=======
#COPY .env .
RUN apk add --no-cache --upgrade bash
RUN apk add --no-cache curl
COPY . .
>>>>>>> main

RUN npm install


<<<<<<< ibixler-da-rework
FROM base AS dev
EXPOSE 4200
=======

# Make the script executable
#RUN chmod +x /app/wait.sh

# Set the entrypoint to the script
#ENTRYPOINT ["/app/wait.sh"]

FROM base AS dev

#RUN npm install -g typescript
#RUN npm intall -g @angular/cli
CMD ["npm", "run", "dev"]
#Production stage
FROM base AS build
RUN npm run build

FROM node:alpine3.20 AS prod
>>>>>>> main

#RUN npm install -g typescript
#RUN npm intall -g @angular/cli
CMD ["npm", "run", "dev"]
#test stage
FROM base AS test

CMD ["npm", "run", "test"]

#Production stage
FROM base AS build
RUN npm run build

FROM base AS prod

CMD ["npm", "run", "start"]