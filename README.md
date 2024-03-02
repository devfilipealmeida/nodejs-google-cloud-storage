# Node.js Google Cloud Storage API (Em desenvolvimento)

![Node.js](https://img.shields.io/badge/Node.js-v14.17.0-green)
![Google Cloud Storage](https://img.shields.io/badge/Google%20Cloud%20Storage-API-blue)

Projeto criado com o intuito de demonstrar a integração entre Node.js e o Google Cloud Storage. A API simplifica o processo de inserção de um arquivo em um Bucket existente e fornece um link autenticado para download.

## Funcionalidades

- [x] Inserir arquivo em um Bucket do Google Cloud Storage.
- [x] Gerar link autenticado para download do arquivo.

## Pré-requisitos

- Node.js v14.17.0 ou superior
- Conta no Google Cloud Platform com acesso ao Google Cloud Storage

## Instalação

1. Clone o repositório:

```
git clone https://github.com/filipedower/nodejs-google-cloud-storage.git
```

2. Instale as dependências:

```
npm install
```

3. Configure as credenciais do Google Cloud Platform no arquivo `.env`:

```
GOOGLE_APPLICATION_CREDENTIALS=seu-arquivo-de-credenciais.json
```

## Uso

1. Execute o servidor:

```
npm start
```

2. Faça uma requisição para inserir um arquivo:

```
POST /upload
```

3. Receba o link autenticado para download:

```
GET /download/:idArquivo
```

## Contribuição

Contribuições são bem-vindas! Para sugestões, abra uma issue. Para mudanças significativas, por favor, abra uma issue primeiro para discutir o que você gostaria de mudar.

## Licença

[MIT](https://choosealicense.com/licenses/mit/)
