FROM node:18-buster AS builder

WORKDIR /app
COPY package*.json ./

RUN yarn install

COPY . .

RUN yarn build

FROM nginx:latest AS production
COPY ./config/api_dealer.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/build /usr/share/nginx/html
