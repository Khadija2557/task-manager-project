FROM node:18-alpine

WORKDIR /app

# Copy only package files first for better layer caching
COPY package*.json ./

# Install dependencies and clean cache in same RUN layer
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

# Copy only necessary files (add a .dockerignore file)
COPY . .

# Add tini and clean up in one layer
RUN apk add --no-cache tini && \
    rm -rf /var/cache/apk/*

USER node
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["npm", "start"]

EXPOSE 6000