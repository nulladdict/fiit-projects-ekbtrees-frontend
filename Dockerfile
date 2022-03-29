# Как использовать:
# 1) docker build -t ekbtrees-frontend . (ekbtrees-frontend можно по желанию поменять)
# 2) docker run ekbtrees-frontend
# 3) После выполнения предыдущей команды в первой строке докер покажет адрес на локалхосте
# 4) Зайти на адрес:3000
FROM node:14-alpine
RUN mkdir -p /app
WORKDIR /app
COPY ./package*.json ./
COPY ./src /app/src
COPY ./public /app/public
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]