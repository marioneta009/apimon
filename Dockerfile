# Usa la imagen oficial de Node.js como base
FROM node:lts-alpine3.19

# Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# Copia el archivo package.json e package-lock.json (si existe) a /app
COPY . .

# Instala las dependencias de la aplicación
RUN npm install

# Expone el puerto en el que la aplicación va a estar corriendo
EXPOSE 3000

# Comando para iniciar la aplicación cuando el contenedor se ejecute
CMD ["npm", "run", "start"]
