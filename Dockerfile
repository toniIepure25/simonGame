# Use a minimal base image for serving static files
FROM nginx:alpine AS base

# Copy the static files to the Nginx HTML directory
COPY . /usr/share/nginx/html

# Expose the default Nginx port
EXPOSE 80

# Start Nginx
CMD ["nginx", "-g", "daemon off;"]