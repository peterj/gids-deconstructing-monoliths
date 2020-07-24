FROM node:14

WORKDIR /app

EXPOSE 3000
CMD ["npm", "start"]

ENV CI=true
COPY package* ./
RUN npm ci
COPY . .