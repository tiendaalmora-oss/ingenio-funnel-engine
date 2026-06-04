FROM node:18-slim
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expone el puerto del webhook
EXPOSE 3000

CMD ["npm", "start"]
