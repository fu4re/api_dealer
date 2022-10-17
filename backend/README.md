# API Dealer Backend

![N|VTB](https://developer.vtb.ru/sites/developer.vtb.ru/themes/vtb_theme/images/logo.png)

Приложение, предоставляющее REST API для фронтэнд монолита приложения API Диллер.

## Features

- RPC клиент для взаимодействия с очередью сообщений на запросы в API ВТБ
- Полноценный рабочий API на фреймворке Grape API с описанными и фиксированными entity
- Прототип системы отчетов
- Оптимизированное взаимодействие с БД PostgreSQL

## Installation


```sh
git clone git@gitlab.bankingapi.ru:vtb-api/backend.git
cd backend
docker build --target development --tag backend:master .
docker run --rm -it backend:master bundle exec rails db:create db:migrate db:seed
docker run --rm -it -v $(pwd):/opt/app -p 3000:3000 backend:master
```

Затем перейти по `localhost:3000` и проверить работу 
