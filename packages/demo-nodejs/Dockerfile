FROM node:13
WORKDIR /usr/src/demo-nodejs

COPY ./lerna.json ./lerna.json
COPY ./package.json ./package.json

COPY ./packages/common ./packages/common
COPY ./packages/sdk ./packages/sdk
COPY ./packages/demo-nodejs ./packages/demo-nodejs

RUN npm install
RUN npx lerna bootstrap
RUN npx lerna exec npm run build

EXPOSE 38080
CMD [ "npm", "run", "demo-nodejs" ]