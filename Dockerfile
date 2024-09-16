#Build stage
FROM node:alpine3.20 AS base

WORKDIR /app

#COPY .env .
RUN apk add --no-cache --upgrade bash
RUN apk add --no-cache curl
COPY . .

RUN npm install


COPY wait.sh /app/

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

WORKDIR /app

COPY package*.json .

RUN npm ci --only=production

COPY --from=build /app/dist ./dist

CMD ["node", "dist/app.js"]