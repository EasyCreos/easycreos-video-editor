FROM node:18-alpine

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install -g pnpm
RUN pnpm install

COPY . .

RUN pnpm run build

EXPOSE 3000
CMD ["pnpm", "run", "start"]
