###########################################
# Build Stage                             #
###########################################
FROM node:22-bookworm-slim AS build

LABEL Maintainer="Mahdi Haghverdi <mahdihaghverdiliewpl@gmail.com>"

WORKDIR /app

RUN apt-get -y update && \
    apt-get install --no-install-recommends -y \
    build-essential software-properties-common;

COPY menuchi-app/ ./

RUN npm ci && \
    npm install -g @angular/cli && \
    npm run build --omit=dev

# ###########################################
# # Runtime Stage                           #
# ###########################################
FROM nginx:1.27.4-bookworm AS runtime

RUN rm -rf /usr/share/nginx/html/*

COPY .docker/nginx/nginx.conf /etc/nginx/
COPY --from=build /app/dist/menuchi-app/browser /usr/share/nginx/html
