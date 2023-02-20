FROM node:14-alpine

RUN mkdir -p /usr/src/nodeflux-auth-api
RUN mkdir -p /usr/src/nodeflux-auth-api/data

WORKDIR /usr/src/nodeflux-auth-api

COPY package*.json ./
RUN npm config set package-lock false
RUN npm install
RUN npm audit fix

COPY . .

EXPOSE 5001
CMD ["npm", "run", "start"]
