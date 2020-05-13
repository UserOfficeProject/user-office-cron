FROM node:12

USER node

WORKDIR /home/node

COPY package*.json ./

RUN npm install --production

COPY . .

ENV  NODE_ENV production

CMD ["node", "index.js"]