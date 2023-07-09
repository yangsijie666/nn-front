FROM node:18.0.0 as builder

WORKDIR /usr/src/app/
USER root

COPY package.json ./
RUN npm install tyarn -g && tyarn

COPY ./ ./

RUN yarn run build

FROM nginx

WORKDIR /usr/share/nginx/html/

COPY ./deploy/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /usr/src/app/dist /usr/share/nginx/html/

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
