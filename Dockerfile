FROM node:lts-alpine3.20
WORKDIR /app
COPY yarn.lock package.json ./

RUN yarn install

COPY . .

EXPOSE 3000

CMD ["yarn", "dev", "--host", "0.0.0.0"]
