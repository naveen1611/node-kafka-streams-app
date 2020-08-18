FROM node:current-slim

WORKDIR /usr/src/ads

COPY . .

RUN npm install
RUN npm run build
COPY . .

EXPOSE 8080
CMD [ "cd", "dist" ]
CMD [ "npm", "start" ]
