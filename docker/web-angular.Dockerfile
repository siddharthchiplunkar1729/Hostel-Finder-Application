FROM node:24-alpine AS build
WORKDIR /workspace

COPY apps/web-angular/package.json apps/web-angular/package.json
COPY apps/web-angular/package-lock.json apps/web-angular/package-lock.json
COPY apps/web-angular/.npmrc apps/web-angular/.npmrc
COPY apps/web-angular/angular.json apps/web-angular/angular.json
COPY apps/web-angular/tsconfig.json apps/web-angular/tsconfig.json
COPY apps/web-angular/tsconfig.app.json apps/web-angular/tsconfig.app.json
COPY apps/web-angular/src apps/web-angular/src

WORKDIR /workspace/apps/web-angular
RUN npm ci
RUN npx ng build --configuration production

FROM nginx:1.29-alpine
COPY docker/nginx-angular.conf /etc/nginx/conf.d/default.conf
COPY --from=build /workspace/apps/web-angular/dist/web-angular/browser /usr/share/nginx/html

EXPOSE 80
