FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache \
  openssl \
  curl

COPY package*.json ./
COPY prisma ./prisma

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build

EXPOSE 3005

CMD ["sh", "-c", "npx prisma migrate deploy && npm run seed && npm run dev"]