FROM node

WORKDIR /socket_chat/

COPY package.json /socket_chat/

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "run", "dev"]