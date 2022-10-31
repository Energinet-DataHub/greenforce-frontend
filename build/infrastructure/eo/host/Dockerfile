FROM nginx:stable-alpine

ARG APP_FOLDER=./artifacts/app-eo/

COPY $APP_FOLDER /usr/share/nginx/html/
COPY ./build/infrastructure/eo/host/nginx.conf /etc/nginx/conf.d/default.conf

# HTTP and HTTPS (managed by API gateway)
EXPOSE 80
