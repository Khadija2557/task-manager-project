# Stage 1: Build
FROM node:18-alpine as builder

WORKDIR /app

# Copy only package files first
COPY package*.json ./

# Install dependencies and clean cache
RUN npm install --legacy-peer-deps && \
    npm cache clean --force

COPY . .

# Build and clean up unnecessary files
RUN npm run build && \
    rm -rf node_modules && \
    npm install --omit=dev --legacy-peer-deps

# Stage 2: Serve
FROM node:18-alpine

WORKDIR /app

# Copy only necessary files from builder
COPY --from=builder /app/.next /app/.next
COPY --from=builder /app/public /app/public
COPY --from=builder /app/package*.json /app/
COPY --from=builder /app/node_modules /app/node_modules

# Next.js environment
ENV NODE_ENV=production

EXPOSE 3000
CMD ["npm", "start"]