FROM node:14
WORKDIR /app
COPY . .
RUN npm link
CMD /usr/local/bin/distributions