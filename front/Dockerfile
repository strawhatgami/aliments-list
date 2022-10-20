FROM node:18-alpine

WORKDIR /usr/src
COPY front/package.json ./
COPY front/yarn.lock ./
RUN npm install
WORKDIR /usr/src/front
COPY front/ .
EXPOSE 3000
CMD ["npm", "run", "dev"]
