FROM node:16.8.0
WORKDIR /usr/src/clen-node-api
COPY ./package.json .
RUN yarn install --production
