FROM node:lts-alpine
USER node:node
WORKDIR /app
COPY --chown=node:node . .
ENTRYPOINT ["sh", "-c", "node --env-file=.env index.js $top_count"]
