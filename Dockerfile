# Etapa 1: instalar dependencias de producción de forma reproducible
FROM node:20-bookworm-slim AS deps
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ \
    && rm -rf /var/lib/apt/lists/*
COPY package*.json ./
RUN npm ci --omit=dev

# Etapa 2: imagen final, liviana y sin dependencias de desarrollo
FROM node:20-bookworm-slim AS runtime
WORKDIR /app

ENV NODE_ENV=production \
    PORT=8080

COPY --from=deps /app/node_modules ./node_modules
COPY package*.json ./
COPY src ./src
COPY README.md ./

# Certificados para MongoDB Atlas y permisos para las imágenes subidas con multer
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/* \
    && mkdir -p /app/src/public/img /app/logs && chown -R node:node /app

USER node

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "fetch('http://localhost:' + process.env.PORT + '/api/docs.json').then(r => process.exit(r.ok ? 0 : 1)).catch(() => process.exit(1))"

CMD ["node", "src/server.js"]
