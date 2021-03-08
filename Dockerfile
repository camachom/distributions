FROM node:14
WORKDIR /app
COPY . .
RUN npm link
ENTRYPOINT ["/usr/local/bin/distribution"]