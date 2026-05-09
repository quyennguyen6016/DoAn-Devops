FROM node:22-bookworm-slim

WORKDIR /app

COPY backend/package*.json ./
RUN npm ci --omit=dev

COPY backend/ ./
RUN chmod +x ./docker-entrypoint.sh

EXPOSE 4000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "src/server.js"]
