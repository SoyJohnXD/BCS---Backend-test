# Production build for Next.js app
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
# No hay package-lock.json, usar npm install y luego prune para limpiar dev deps si se quiere después.
RUN npm install

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time API URL for client bundle
ARG NEXT_PUBLIC_API_GATEWAY_URL
ENV NEXT_PUBLIC_API_GATEWAY_URL=${NEXT_PUBLIC_API_GATEWAY_URL}
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000
# Runtime variables (server-side)
ENV API_GATEWAY_URL=
ENV NEXT_PUBLIC_API_GATEWAY_URL=
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["npm", "run", "start"]