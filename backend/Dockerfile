FROM node:20-alpine AS base
FROM base AS dependencies
WORKDIR /src
COPY package.json package-lock.json ./
RUN npm install
FROM dependencies AS build
WORKDIR /src
COPY . .
RUN npx tsc && npx tsc-alias
FROM base AS production
WORKDIR /src
COPY --from=build /src/dist .
COPY --from=build /src/package.json ./
COPY --from=build /src/package-lock.json ./
RUN npm ci --omit=dev
EXPOSE 5000
CMD ["node","index.js"]
