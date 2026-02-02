FROM node:20-alpine

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

EXPOSE 3001

CMD ["sh", "-c", "if [ \"$RUN_DB_INIT\" = \"true\" ]; then npm run schema:sync && npm run seed; fi && npm run start:prod"]
