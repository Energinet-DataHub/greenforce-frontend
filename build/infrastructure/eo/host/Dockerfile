FROM nginxinc/nginx-unprivileged:alpine-slim

ARG APP_FOLDER=./artifacts/app-eo/

COPY $APP_FOLDER /usr/share/nginx/html/
COPY ./build/infrastructure/eo/host/nginx.conf /etc/nginx/conf.d/default.conf
