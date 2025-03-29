FROM node:16

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Transpile TypeScript files
RUN npm run build

# Expose the port your app runs on
EXPOSE 3001

# Command to run your app
CMD ["node", "dist/index.js"]
