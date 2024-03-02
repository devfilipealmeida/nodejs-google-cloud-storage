const express = require('express');
const { Storage } = require('@google-cloud/storage');
const Multer = require('multer');

const app = express();
const PORT = process.env.PORT || 3000;

const storage = new Storage({
    //Troque para o seu arquivo de credenciais google
    keyFilename: './application_default_credentials.json'
});

//Troque pelo nome do seu Bucket
const bucketName = 'files-to-download';

//Configurações do Multer
//Aqui estabeleci o limite máximo de 5mb
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 //Limite de 5MB
    }
});

app.post('/upload', multer.single('file'), async (req, res) => {
    //Verifica se veio arquivo na requisição
    if (!req.file) {
        return res.status(400).send('Nenhum arquivo anexado');
    }

    //Cria uma referência para o arquivo na Storage usando o nome original dele
    const file = storage.bucket(bucketName).file(req.file.originalname);

    //Cria um stream para escrever o arquivo na Storage e tratar os erros que podem acontecer durante o upload
    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    stream.on('error', (err) => {
        console.error('Erro ao fazer upload do arquivo:', err);
        res.status(500).send('Erro ao fazer upload do arquivo');
    });

    stream.on('finish', async () => {
        const [url] = await file.getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000 // Duração da url (aqui 15 minutos)
        });

       //{ Aqui você coloca sua lógica para salvar a url do arquivo em um banco de dados local para usar quando for fazer o download}
        res.status(200).send('Arquivo enviado com sucesso');
    });

    stream.end(req.file.buffer);
});

app.get('/download', async (req, res) => {
    //Você poderia receber um id do seu usuário e buscar no banco de dados a url ou nome do arquivo que salvamos no banco de dados local durante o upload
    //Para este exemplo, vamos supor que o usuário entraria diretamente com o nome do arquivo
    const fileName = req.query.fileName;

    try {
        //Verifica se o arquivo existe no bucket
        const [exists] = await storage.bucket(bucketName).file(fileName).exists();

        if (!exists) {
            return res.status(404).send('Arquivo não encontrado');
        }

        //Cria uma url autenticada com duração de 15 minutos e retorna para o usuário enfim baixar o arquivo
        const [url] = await storage.bucket(bucketName).file(fileName).getSignedUrl({
            action: 'read',
            expires: Date.now() + 15 * 60 * 1000, // 15 minutos
        });

        res.json({ fileUrl: url });
    } catch (error) {
        console.error('Erro ao gerar URL assinada:', error);
        res.status(500).send('Erro ao gerar URL assinada');
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
