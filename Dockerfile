FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
ARG NUXT_PUBLIC_BEPING_API_BASE_URL=https://api-v2.beping.be
ENV NUXT_PUBLIC_BEPING_API_BASE_URL=$NUXT_PUBLIC_BEPING_API_BASE_URL
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production \
    HOST=:: \
    PORT=3000
COPY --from=builder /app/.output ./.output
USER node
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]
