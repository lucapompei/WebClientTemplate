### STAGE 1: Build ###

# We label our stage as 'builder'
FROM node:14.4.0-alpine3.10 as builder

COPY package*.json ./

# RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /web-app && cp -R ./node_modules ./web-app

WORKDIR /web-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
##RUN $(npm bin)/ng build --prod --build-optimizer
RUN cd /web-app && npm run build --prod --aot

### STAGE 2: Setup ###

FROM nginx:1.19.0-alpine

## Copy our default nginx config
COPY nginx.conf /etc/nginx/nginx.conf

## Remove default nginx website
RUN rm -rf /usr/share/nginx/html/*

## From 'builder' stage copy over the artifacts in dist folder to default nginx public folder
COPY --from=builder /web-app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
