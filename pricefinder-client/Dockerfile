# pricefinder-client/Dockerfile

# Use a more recent version of Node.js
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
