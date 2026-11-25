FROM node:20-alpine

WORKDIR /app

# Сначала копируем только файлы зависимостей — этот слой кэшируется
COPY package*.json ./
RUN npm ci --omit=dev

# Исходный код копируем последним — он меняется чаще всего
COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
