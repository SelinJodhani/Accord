FROM node:lts-alpine
WORKDIR /Accord
COPY package*.json .
RUN npm ci
COPY . .
CMD ["npm", "run", "start:dev"]