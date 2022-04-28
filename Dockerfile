FROM node:14 AS builder

WORKDIR /app

COPY . .

ENV DEPLOYMENT_URL "http://localhost:8080"

RUN yarn install && yarn build

FROM node:14-slim

ENV NODE_ENV production

COPY --from=builder /app/build /build

WORKDIR /build

RUN mkdir /diagrams

EXPOSE 8080/tcp

CMD ["node", "/build/server/bundle.js"]

