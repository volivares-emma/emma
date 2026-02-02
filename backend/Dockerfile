FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "npm run schema:sync && npm run seed && npm run start:prod"]
