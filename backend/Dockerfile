FROM node:22-alpine AS build
WORKDIR /app
ENV DATABASE_URL=postgresql://atelier:atelier_dev_password@postgres:5432/atelier
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/package*.json ./
RUN npm ci --omit=dev
COPY --from=build /app/dist ./dist
COPY --from=build /app/prisma ./prisma
EXPOSE 4000
CMD ["node", "dist/server.js"]
