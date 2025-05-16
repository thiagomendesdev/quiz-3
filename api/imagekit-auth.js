const ImageKit = require('imagekit');

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

module.exports = function handler(req, res) {
  console.log('Received request:', {
    method: req.method,
    url: req.url,
    headers: req.headers
  });

  // Configurar CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  // Responder a requisições OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('Handling OPTIONS request');
    res.status(200).end();
    return;
  }

  try {
    console.log('Generating authentication parameters');
    const auth = imagekit.getAuthenticationParameters();
    console.log('Generated auth parameters:', auth);
    res.status(200).json(auth);
  } catch (error) {
    console.error('Error generating auth parameters:', error);
    res.status(500).json({ error: error.message });
  }
} 