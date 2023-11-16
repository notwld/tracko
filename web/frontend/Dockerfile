FROM node:18

WORKDIR /app/frontend

COPY package*.json ./

RUN pnpm install

COPY . .

CMD ["pnpm", "run", "dev"]
