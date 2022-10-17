#!/bin/bash
# bunny_waiter.sh

set -e

cmd="$@"
  
until curl -i -u guest:guest http://rabbitmq:15672 &> /dev/null; do
  >&2 echo "RabbitMQ is unavailable - sleeping"
  sleep 5
done
  
>&2 echo "RabbitMQ is up - executing command"
exec $cmd
