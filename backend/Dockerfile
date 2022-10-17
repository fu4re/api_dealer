ARG RUBY_VERSION=3.0.1-alpine3.13

FROM ruby:$RUBY_VERSION as development

RUN apk add --no-cache postgresql-dev libc6-compat build-base vim nano git

WORKDIR /opt/app

ENV BUNDLE_JOBS=4 \
    BUNDLE_RETRY=3

ENV RAILS_LOG_TO_STDOUT=true
ENV PIDFILE=/dev/null

COPY Gemfile* ./
RUN bundle install

EXPOSE 3000
CMD puma -b tcp://0.0.0.0:3000

FROM ruby:$RUBY_VERSION as production

RUN apk add --no-cache postgresql-libs gcompat
WORKDIR /opt/app

ENV RAILS_ENV=production
ENV RAILS_LOG_TO_STDOUT=true
ENV PIDFILE=/dev/null

ENV CONTROL_TOKEN=$CONTROL_TOKEN

COPY --from=development /usr/local/bundle /usr/local/bundle
COPY . .

EXPOSE 3000
EXPOSE 9293
CMD puma -b tcp://0.0.0.0:3000 --control-url tcp://0.0.0.0:9293 --control-token ${CONTROL_TOKEN}
