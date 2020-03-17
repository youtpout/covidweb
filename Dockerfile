FROM node:12-alpine as buildContainer
WORKDIR /app
COPY ./package.json ./package-lock.json /app/
RUN npm install
COPY . /app
RUN npm run build:ssr
# RUN npm run generate:prerender

FROM node:8-alpine

WORKDIR /app
# Copy dependency definitions
COPY --from=buildContainer /app/package.json /app
# COPY --from=buildContainer /app/server.js /app

# Get all the code needed to run the app
COPY --from=buildContainer /app/dist /app/dist
# COPY --from=buildContainer /app/static /app/static
# COPY --from=buildContainer /app/dist-server /app/dist-server

# Expose the port the app runs in
EXPOSE 4000

# Serve the app
CMD ["npm", "run", "serve:ssr"]