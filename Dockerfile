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
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
#Production stage
FROM base AS build
RUN npm run build

FROM node:alpine3.20 AS prod

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/app.js"]