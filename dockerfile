# ==== CONFIGURE =====

# Use a Node 16 base image

FROM node:16-alpine as build-stage

# Set the working directory to /app inside the container

WORKDIR /neom-webapp

# Copy app files

COPY ./ /neom-webapp

# ==== BUILD =====

# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)

#RUN apk add --update python3 make g++\

#   && rm -rf /var/cache/apk/*

RUN npm install

#RUN npm ci

# Build the app

RUN npm run build

FROM nginx:alpine

#!/bin/sh

#COPY --from=build-stage /nginx.conf /etc/nginx/default.conf
COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

## Remove default nginx index page

RUN rm -rf /usr/share/nginx/html/*

# Copy from the stahg 1

COPY --from=build-stage /neom-webapp/build/ /usr/share/nginx/html

# ==== RUN =======

# Set the env to "developement"

ENV NODE_ENV developement

# Expose the port on which the app will be running (3000 is the default that `serve` uses)

EXPOSE 3000

# Start the app

#CMD [ "npx", "serve", "build" ]

CMD ["nginx", "-g", "daemon off;"]