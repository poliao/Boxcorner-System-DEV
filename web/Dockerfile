FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# สั่ง build
RUN npm run build --configuration=production

FROM nginx:alpine
# ⚠️ อย่าลืมแก้ 'ชื่อโปรเจกต์' ให้ตรงกับใน angular.json (ดูในโฟลเดอร์ web/dist/...)
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]