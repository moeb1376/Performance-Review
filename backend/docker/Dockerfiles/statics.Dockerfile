FROM nginx:stable-alpine3.17

COPY ./staticfiles/ /usr/share/nginx/html/django-statics

EXPOSE 80
