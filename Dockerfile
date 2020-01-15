FROM node:12.14.0

WORKDIR /home/alec/hack-reactor/stash.it
COPY package.json .
RUN npm install
COPY . .

CMD [ "npm", "start" ]