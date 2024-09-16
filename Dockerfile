#Build stage
FROM node:alpine3.20 AS base

WORKDIR /app

COPY .env .

COPY package*.json .

RUN npm install

COPY . .

FROM base AS dev
EXPOSE 4200

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