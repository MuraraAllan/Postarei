FROM  node:8.6 
# Copy contents into the gateway container 
ADD ./ /
# Set the working directory to   containerr 
WORKDIR /
RUN npm install
# Add node_modules to .dockerignore (size) 
# Define environment variable 
EXPOSE 8000 
ENV Name frontend
