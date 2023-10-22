FROM nginx:stable-alpine3.17

COPY ./configs/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./build/ /usr/share/nginx/html

EXPOSE 80
