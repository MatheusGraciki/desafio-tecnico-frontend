# ===== BUILD STAGE =====
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
RUN npm install

COPY . .
RUN npm run build


# ===== PRODUCTION STAGE =====
FROM nginx:alpine

# limpa nginx default
RUN rm -rf /usr/share/nginx/html/*

# copia build do vite
COPY --from=builder /app/dist /usr/share/nginx/html

# config custom
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]