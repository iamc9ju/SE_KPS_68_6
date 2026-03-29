# backend/Dockerfile
FROM node:20-alpine
WORKDIR /app
# Copy package files และ install ก่อน (เพื่อใช้ cache)
COPY package*.json ./
RUN npm install
# Copy source code ที่เหลือ
COPY . .
# เปิด Port 3000 (Default ของ NestJS)
EXPOSE 3000
# รันในโหมด Development (เพื่อดู Logs และ Error ชัดๆ)
CMD ["npm", "run", "start:dev"]