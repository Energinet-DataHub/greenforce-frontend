FROM nginx:stable-alpine
COPY ./dist/apps/ett/app-ett/ /usr/share/nginx/html/
COPY ./infrastructure/ett/host/nginx.conf /etc/nginx/conf.d/default.conf
# HTTP and HTTPS (managed by API gateway)
EXPOSE 80
