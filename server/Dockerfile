FROM node:20

WORKDIR /cache

COPY package.json .
COPY package-lock.json .
RUN npm install 
COPY . .
RUN npx prisma generate

WORKDIR /server
ENV PATH /server/node_modules/.bin:$PATH
COPY . .
