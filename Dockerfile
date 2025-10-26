# ===== Etapa 1: build =====
FROM node:20-alpine AS builder
# Herramientas por si hay dependencias nativas (bcrypt, sharp, etc.)
RUN apk add --no-cache python3 make g++
# Habilitar pnpm via corepack
RUN corepack enable
WORKDIR /app

# Instala dependencias con lockfile
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copia el resto del código y compila
COPY . .
RUN pnpm build


# ===== Etapa 2: runtime mínimo =====
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copia solo lo necesario para ejecutar
COPY --from=builder /app/dist ./dist
COPY package.json pnpm-lock.yaml ./

# Instala solo deps de producción
RUN corepack enable && pnpm install --prod --frozen-lockfile

EXPOSE 3000
CMD ["node", "dist/main.js"]
