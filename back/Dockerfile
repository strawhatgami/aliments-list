FROM node:18-alpine

WORKDIR /usr/src
COPY back/package*.json ./
RUN npm install
WORKDIR /usr/src/back
COPY back/ .
EXPOSE 3000
CMD ["npm", "start"]




