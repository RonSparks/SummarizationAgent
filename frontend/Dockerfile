FROM nginx:alpine

# Copy the static files to nginx's default serving directory
COPY . /usr/share/nginx/html/

# Copy a custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 