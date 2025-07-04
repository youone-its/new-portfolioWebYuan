# server/Dockerfile

FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install deps
COPY package*.json ./
RUN npm install

# Copy the rest
COPY . .

# Jalankan build kalau perlu
# RUN npm run build

# Expose port dan start
EXPOSE 3000
CMD ["npm", "run", "dev"]
