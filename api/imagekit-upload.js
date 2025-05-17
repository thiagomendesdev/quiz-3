const ImageKit = require('imagekit');
const formidable = require('formidable');
const fs = require('fs');

// Log das variáveis de ambiente (sem mostrar a private key)
console.log('Environment variables:', {
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY ? 'Set' : 'Not set',
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY ? 'Set' : 'Not set',
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

// Verificar se todas as variáveis de ambiente necessárias estão definidas
if (!process.env.IMAGEKIT_PUBLIC_KEY || !process.env.IMAGEKIT_PRIVATE_KEY || !process.env.IMAGEKIT_URL_ENDPOINT) {
  console.error('Missing required environment variables');
  throw new Error('Missing required environment variables');
}

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
});

module.exports = async function handler(req, res) {
  console.log('Received request:', {
    method: req.method,
    url: req.url,
    headers: req.headers
  });

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Responder a requisições OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const form = formidable({});
    const [fields, files] = await form.parse(req);
    const file = files.file?.[0];

    if (!file) {
      console.error('No file uploaded');
      res.status(400).json({ error: 'No file uploaded' });
      return;
    }

    console.log('Processing file upload:', {
      fileName: file.originalFilename,
      fileSize: file.size,
      fileType: file.mimetype
    });

    // Ler o arquivo
    const fileBuffer = fs.readFileSync(file.filepath);

    // Fazer upload para o ImageKit
    const result = await imagekit.upload({
      file: fileBuffer,
      fileName: file.originalFilename,
      useUniqueFileName: true
    });

    console.log('Upload successful:', result);
    res.status(200).json(result);

  } catch (error) {
    console.error('Error processing upload:', error);
    res.status(500).json({ 
      error: error.message,
      details: error.stack
    });
  }
} 