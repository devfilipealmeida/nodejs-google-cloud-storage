const express = require('express');
const { Storage } = require('@google-cloud/storage');

const app = express();
const PORT = process.env.PORT || 3000;

// Configure o Google Cloud Storage com suas credenciais
const storage = new Storage({
    keyFilename: './application_default_credentials.json' // Substitua pelo caminho do seu arquivo de credenciais
});
const bucketName = 'files-to-download'; // Substitua pelo nome do seu bucket

// Rota para gerar URL assinada para download do arquivo
app.get('/download', async (req, res) => {
    const fileName = req.query.fileName;

    try {
        // Verifique se o arquivo existe
        const [exists] = await storage.bucket(bucketName).file(fileName).exists();

        if (!exists) {
            return res.status(404).send('Arquivo não encontrado');
        }

        // Gere uma URL assinada para o arquivo
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

// Inicie o servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
