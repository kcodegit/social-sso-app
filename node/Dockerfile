FROM node:lts-alpine

COPY ./node /home/app

WORKDIR /home/app

# add some dependencies for bcrypt
RUN apk --update --no-cache add --virtual .buildDep python gcc g++ make \
    && yarn global add node-gyp

RUN yarn install

# RUN apk del .buildDep

EXPOSE 3000 9229
