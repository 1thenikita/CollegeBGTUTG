FROM node:12

WORKDIR /bot

COPY package*.json ./
COPY tsconfig.json ./

COPY node_modules ./node_modules
COPY src ./src

RUN npm run build

ENV TZ=Europe/Moscow
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

CMD [ "npm", "run", "start" ]