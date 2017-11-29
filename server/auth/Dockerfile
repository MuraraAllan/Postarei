FROM  node:8.6
# Copy contents into the gateway container
ADD  src/ /gateway
# Set the working directory to   container
WORKDIR /gateway
COPY package.json /gateway/package.json
COPY secretdocker.js /gateway/secret.js
# Added node_modules to .dockerignore (size)
RUN npm install
# Define environment variable
ENV Name gateway
