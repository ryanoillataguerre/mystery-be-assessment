FROM node:16

RUN apt update

WORKDIR /app

COPY package.json ./
COPY lerna.json ./
COPY yarn.lock ./
COPY services/api-service ./services/api-service

RUN yarn

WORKDIR /app/services/api-service
RUN yarn build

EXPOSE 8080

CMD ["yarn", "start"]
