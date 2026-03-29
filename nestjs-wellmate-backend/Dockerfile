# Stage 1: Build
FROM node:20-alpine AS build
# ติดตั้ง openssl สำหรับ Prisma
RUN apk add --no-cache openssl
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npm run build
RUN npx prisma generate

# Stage 2: Runtime
FROM node:20-alpine
RUN apk add --no-cache openssl
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
COPY --from=build /app/prisma ./prisma

# Railway จะใช้ PORT จาก Environment Variable
EXPOSE 4000
CMD ["npm", "run", "start:prod"]