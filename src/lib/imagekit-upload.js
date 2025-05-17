import ImageKit from 'imagekit-javascript';

// Log detalhado das variáveis de ambiente do frontend
const config = {
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
  apiUrl: import.meta.env.VITE_API_URL
};

console.log('Frontend ImageKit config:', {
  publicKey: config.publicKey ? 'Set' : 'Not set',
  urlEndpoint: config.urlEndpoint ? 'Set' : 'Not set',
  apiUrl: config.apiUrl ? 'Set' : 'Not set',
  fullConfig: config
});

// Verificar se todas as variáveis necessárias estão definidas
if (!config.publicKey || !config.urlEndpoint || !config.apiUrl) {
  console.error('Missing required environment variables:', {
    publicKey: !config.publicKey,
    urlEndpoint: !config.urlEndpoint,
    apiUrl: !config.apiUrl
  });
  throw new Error('Missing required environment variables');
}

// Inicializar o cliente ImageKit
const imagekit = new ImageKit({
  publicKey: config.publicKey,
  urlEndpoint: config.urlEndpoint
});

export async function uploadToImageKit(file) {
  try {
    console.log('Starting upload process...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Obter as credenciais de autenticação
    const authResponse = await fetch(`${config.apiUrl}/api/imagekit-auth`);
    if (!authResponse.ok) {
      throw new Error('Failed to get authentication parameters');
    }
    const auth = await authResponse.json();

    // Fazer upload diretamente para o ImageKit
    const result = await imagekit.upload({
      file: file,
      fileName: file.name,
      useUniqueFileName: true,
      signature: auth.signature,
      token: auth.token,
      expire: auth.expire
    });

    console.log('Upload successful:', result);

    if (!result.filePath) {
      throw new Error('Invalid response from ImageKit: missing filePath');
    }

    // Retornar a URL completa da imagem
    return `${config.urlEndpoint}/${result.filePath}`;

  } catch (error) {
    console.error('Error in upload process:', error);
    throw error;
  }
}

// ATENÇÃO: Crie um arquivo .env.local na raiz do projeto com:
// VITE_IMAGEKIT_PUBLIC_KEY=sua_public_key_imagekit
// VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/seu_id
// VITE_API_URL=https://seu-dominio.vercel.app 