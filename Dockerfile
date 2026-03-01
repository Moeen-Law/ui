# ---- Build Stage ----
FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts

COPY . .
RUN npm run build

# ---- Production Stage ----
FROM nginx:1.27-alpine-slim

# Remove default nginx static assets and config
RUN rm -rf /usr/share/nginx/html/* /etc/nginx/conf.d/*

# Create a non-root user for nginx and all required temp/runtime dirs
RUN addgroup -S moeen && adduser -S -G moeen moeen \
    && mkdir -p /tmp/nginx \
    /var/cache/nginx/client_temp \
    /var/cache/nginx/proxy_temp \
    /var/cache/nginx/fastcgi_temp \
    /var/cache/nginx/uwsgi_temp \
    /var/cache/nginx/scgi_temp \
    && chown -R moeen:moeen /tmp/nginx /var/cache/nginx /etc/nginx/conf.d

COPY nginx.conf /etc/nginx/nginx.conf

COPY --from=build --chown=moeen:moeen /app/dist /usr/share/nginx/html

# Ensure static files are read-only
RUN chmod -R 444 /usr/share/nginx/html \
    && find /usr/share/nginx/html -type d -exec chmod 555 {} +

USER moeen

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD wget -qO /dev/null http://localhost:8080/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
