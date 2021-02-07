FROM node:12

RUN apt-get update && apt-get install -y ffmpeg

WORKDIR /usr/app

COPY package*.json ./
RUN yarn

ENV TZ=Asia/Tokyo

COPY . .
RUN yarn compile

CMD ["yarn", "start"]
