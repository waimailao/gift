# build front-end
FROM registry.cn-hangzhou.aliyuncs.com/antpro/node:lts-alpine3.18 AS frontend

RUN npm install pnpm -g

WORKDIR /app

COPY ./package.json /app

COPY ./pnpm-lock.yaml /app

RUN pnpm install --registry=https://registry.npmmirror.com/

COPY . /app

RUN pnpm run build --mode production

RUN find /app/dist -name "*.map" -type f -delete

FROM registry.cn-hangzhou.aliyuncs.com/antpro/nginx:stable-alpine

COPY --from=frontend /app/dist /usr/share/nginx/html

COPY ./develop/nginx.conf /etc/nginx/nginx.conf
COPY ./develop/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

ENTRYPOINT nginx -g "daemon off;"
