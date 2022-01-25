FROM node:17

WORKDIR /bot

COPY package*.json ./
COPY tsconfig.json ./
COPY src ./src
RUN ls -a

RUN npm install
RUN npm run build

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD [ "npm", "run", "start" ]