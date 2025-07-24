# Dockerfile
FROM node:20-alpine

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia los archivos de definición de dependencias
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código de la aplicación
COPY . .

# *** AÑADE ESTA LÍNEA AQUÍ ***
# Configura NODE_OPTIONS para ayudar a Node.js con la resolución de módulos ESM/CommonJS
ENV NODE_OPTIONS="--no-warnings --experimental-json-modules --loader ts-node/esm"

# Compila la aplicación (para TypeScript)
RUN npm run build

# Expone el puerto en el que la aplicación escuchará
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor se ejecute
CMD ["node", "dist/main"]