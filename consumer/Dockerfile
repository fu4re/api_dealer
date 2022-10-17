ARG RUBY_VERSION=2.7.1-alpine3.12

FROM ruby:$RUBY_VERSION as development

RUN apk add --no-cache build-base curl

WORKDIR /opt/app

COPY Gemfile Gemfile.lock ./
RUN bundle install

FROM ruby:$RUBY_VERSION as production

RUN apk add --no-cache curl

WORKDIR /opt/app

ENV APP_ENV=production
ENV LOGGER_LEVEL=info

COPY --from=development /usr/local/bundle /usr/local/bundle
COPY . .

