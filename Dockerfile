FROM node:18-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expone el puerto del webhook
EXPOSE 3000

CMD ["npm", "start"]
