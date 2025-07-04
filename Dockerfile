# Gunakan base image node
FROM node:18

# Set working dir ke app
WORKDIR /app

# Copy semua file ke image
COPY . .

# Install dependency
RUN npm install

# Build backend
RUN npm run build

# Jalankan server
CMD ["npm", "start"]
