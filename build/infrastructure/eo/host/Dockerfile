FROM nginx:stable-alpine

ARG APP_FOLDER=./artifacts/app-eo/

COPY $APP_FOLDER /usr/share/nginx/html/
COPY ./build/infrastructure/eo/host/nginx.conf /etc/nginx/conf.d/default.conf

HEALTHCHECK CMD wget -qO- http://localhost:80/ > /dev/null || exit 1
