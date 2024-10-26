FROM node:18.17-alpine3.18 AS development
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN ./node_modules/.bin/prisma generate && npm run build

FROM node:18.17-alpine3.18 as production
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /usr/src/app
COPY package*.json ./
COPY prisma ./prisma
RUN npm install --omit=dev && ./node_modules/.bin/prisma generate
COPY --from=development /usr/src/app/dist ./dist
COPY src/dataSample/DataSampleJP.xlsx ./src/dataSample/DataSampleJP.xlsx
COPY src/dataSample/MasterCode.xlsx ./src/dataSample/MasterCode.xlsx
CMD /bin/sh -c "./node_modules/.bin/prisma migrate deploy --preview-feature && npm run start:prod"
