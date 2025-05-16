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

module.exports = async function handler(req, res) {
  // Configurar CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Responder a requisições OPTIONS
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Apenas permitir requisições GET
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    console.log('Generating authentication parameters...');
    const result = imagekit.getAuthenticationParameters();
    console.log('Auth parameters generated:', result);
    
    if (!result.token || !result.signature || !result.expire) {
      throw new Error('Missing required authentication parameters');
    }
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error generating auth parameters:', error);
    res.status(500).json({ 
      error: 'Failed to generate authentication parameters',
      details: error.message
    });
  }
} 