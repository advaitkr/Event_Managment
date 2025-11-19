FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN if [ -f package-lock.json ]; then npm ci --production=false; else npm install --production=false; fi
COPY . .
EXPOSE 5000
CMD ["node", "server.js"]
