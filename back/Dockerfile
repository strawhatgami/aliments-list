FROM node:18-alpine

# note: potential security issue
WORKDIR /usr/src
COPY back/package*.json ./
RUN npm install
WORKDIR /usr/src/back
COPY . .
EXPOSE 3000
CMD ["npm", "start"]




