# Pagebox

## Projeto de diretórios para controle de arquivos

### Front-End - React + Typescript

## Preparativos para testar o projeto localmente

### 1. Instalar o Docker

Antes de começar, certifique-se de ter o Docker instalado. Você pode baixar e instalar o Docker a partir do site oficial: [Docker Download](https://www.docker.com/get-started).

Após a instalação, abra o **CMD** ou o **Terminal** em seu sistema operacional.

#### Verifique a Instalação do Docker

Para garantir que o Docker está funcionando corretamente, execute o seguinte comando:

```
docker --version
```

### 2. Executando o Banco de Dados MySQL

O primeiro passo é iniciar o container do MySQL. Este container será responsável por armazenar os dados da aplicação.

#### No CMD/Terminal, execute o seguinte comando para iniciar o MySQL:

```
docker run -d --name mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=pagebox -p 3306:3306 -v mysql_data:/var/lib/mysql mysql:8
```

### 3. Executando o Backend

Com o MySQL em execução, agora podemos iniciar o backend da aplicação.

#### No CMD/Terminal, execute o seguinte comando para iniciar o backend:

```
docker run -d --name backend --link mysql:mysql -e SPRING_DATASOURCE_URL="jdbc:mysql://mysql:3306/pagebox?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo" -e SPRING_DATASOURCE_USERNAME=root -e SPRING_DATASOURCE_PASSWORD=root -p 8080:8080 rockgustavo/pagebox:1.1
```

### 4. Executando o Frontend

Por último, vamos iniciar o frontend da aplicação.

#### No CMD/Terminal, execute o seguinte comando para iniciar o frontend:

```
docker run -d --name frontend -p 3000:80 rockgustavo/pageboxfront:1.0
```

### 5. Acessando a Aplicação

#### Agora que todos os containeres estão em execução, você pode acessar a aplicação da seguinte forma:

```
http://localhost:3000
```

### 6. Parando e Removendo os Contêineres

#### Parar os Containeres:

```
docker stop frontend backend mysql
```

#### Remover os Containeres:

```
docker rm frontend backend mysql
```

### 7. Limpando Volumes

#### Se quiser limpar os volumes criados durante a execução dos containeres, use o comando:

```
docker volume rm mysql_data
```

## Deploy pelo Vercel - Acompanhe em tempo real como está ficando o projeto

```
pageboxfront01.vercel.app
```

### Documentação do projeto

Após rodar o container utilize esta **URL**:

```
http://localhost:8080/swagger-ui/index.html#/

```

## Back-End deste projeto:

```
https://github.com/rockgustavo/pagebox
```
