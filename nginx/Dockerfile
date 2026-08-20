# Builds the frontend, then serves it via Nginx — the same Nginx that
# load-balances API traffic across the backend replicas (see nginx.conf).
FROM node:22-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
# In production, the browser calls same-origin /api — Nginx forwards that
# to the backend upstream, so no backend hostname needs to be baked in here.
ENV VITE_API_URL=/api
RUN npm run build

FROM nginx:alpine
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
