FROM node:20-alpine AS build

WORKDIR /app

COPY frontend/package.json frontend/package-lock.json ./
COPY frontend/apps/web/package.json ./apps/web/
COPY frontend/packages/ui/package.json ./packages/ui/
COPY frontend/turbo.json ./

RUN npm ci

COPY frontend/ .

RUN npm run build

FROM nginx:alpine

COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html

EXPOSE 80
