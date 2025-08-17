FROM node:22-alpine

WORKDIR /app

#"import" dependencies
COPY package*.json ./

#installl dependencies
RUN npm ci --omit=dev 

#copy the rest of the app
COPY . .

RUN chmod +x /app/my_script.sh

USER node

ENTRYPOINT ["/app/my_script.sh"]