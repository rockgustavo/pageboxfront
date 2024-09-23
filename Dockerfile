# Etapa 1: Build do projeto React
FROM node:18-alpine AS build

WORKDIR /app

# Copia os arquivos de configuração
COPY package*.json ./

# Instala as dependências do projeto
RUN npm install

# Copia o código fonte para o diretório de trabalho
COPY . .

# Faz o build do projeto React
RUN npm run build

# Etapa 2: Configuração do Nginx para servir o app React
FROM nginx:alpine

# Copia os arquivos construídos para a pasta do Nginx
COPY --from=build /app/dist /usr/share/nginx/html

# Remove a configuração padrão do Nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia a configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d

# Expondo a porta 80 para o Nginx
EXPOSE 80

# Comando para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
