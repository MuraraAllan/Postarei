FROM  node:8.6 
# Copy contents into the gateway container 
ADD ./ /oauth
# Set the working directory to   containerr 
WORKDIR /oauth
# Added node_modules to .dockerignore (size) 
RUN npm install 
# Define environment variable 
EXPOSE 8000 
ENV Name oauth
