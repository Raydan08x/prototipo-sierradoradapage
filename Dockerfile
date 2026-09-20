# Build stage
FROM node:18-alpine AS build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
ARG VITE_GOOGLE_CLIENT_ID
ENV VITE_GOOGLE_CLIENT_ID=$VITE_GOOGLE_CLIENT_ID
ARG VITE_BASE_PATH=/prototipo-sierradoradapage/
ARG VITE_GASTROBAR_MENU_URL
ENV VITE_BASE_PATH=$VITE_BASE_PATH
ENV VITE_GASTROBAR_MENU_URL=$VITE_GASTROBAR_MENU_URL
RUN npm run build

# Production stage
FROM nginx:stable-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 8880
CMD ["nginx", "-g", "daemon off;"]
