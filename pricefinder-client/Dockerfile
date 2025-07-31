# Stage 1: Build the React application
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve the static files with Nginx
FROM nginx:1.27-alpine
# Copy the custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf
# Copy the built static files from the 'build' stage
COPY --from=build /app/dist /usr/share/nginx/html
# Expose Nginx's default port
EXPOSE 80
# Start Nginx
CMD ["nginx", "-g", "daemon off;"]
