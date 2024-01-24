FROM nginx:stable-alpine

ARG APP_FOLDER

COPY $APP_FOLDER /usr/share/nginx/html/
COPY ./build/infrastructure/eov/host/nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK CMD wget -qO- http://localhost:80/ > /dev/null || exit 1

CMD ["/bin/sh",  "-c",  "envsubst < /usr/share/nginx/html/assets/configuration/eov-api-environment.build.json > /usr/share/nginx/html/assets/configuration/eov-api-environment.json && nginx -g 'daemon off;'"]
