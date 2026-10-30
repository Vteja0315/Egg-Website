# Use an ultra-lightweight static web server image
FROM flashspys/nginx-static:latest

# Copy web source into the container distribution directory
COPY . /usr/share/nginx/html/

# Expose default HTTP traffic port
EXPOSE 80
