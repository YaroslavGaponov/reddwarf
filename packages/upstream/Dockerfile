FROM node:13
WORKDIR /usr/src/upstream

COPY ./lerna.json ./lerna.json
COPY ./package.json ./package.json

COPY ./packages/common ./packages/common
COPY ./packages/sdk ./packages/sdk
COPY ./packages/upstream ./packages/upstream

RUN npm install
RUN npx lerna bootstrap
RUN npx lerna exec npm run build

EXPOSE 38080
CMD [ "npm", "run", "upstream" ]