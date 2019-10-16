FROM node:10

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
COPY .env ./
COPY . .

RUN npm install -g pm2
RUN npm install
RUN npm --prefix ./svelte install
RUN npm --prefix ./svelte run build
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 8080
CMD [ "pm2-runtime", "app.js" ]
