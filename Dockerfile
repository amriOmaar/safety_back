FROM node:alpine
WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm install
COPY . .
COPY ./.env ./
COPY ./config/db.js ./
CMD ["npm", "start"]