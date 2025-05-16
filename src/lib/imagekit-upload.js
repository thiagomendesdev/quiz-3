import ImageKit from 'imagekit-javascript'

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

export async function uploadToImageKit(file) {
  try {
    console.log('Starting upload process...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // 1. Primeiro, obter o token de autenticação
    console.log('Fetching authentication token...');
    const authResponse = await fetch(`${config.apiUrl}/api/imagekit-auth`);
    if (!authResponse.ok) {
      throw new Error(`Failed to get auth token: ${authResponse.statusText}`);
    }
    const authData = await authResponse.json();
    console.log('Received auth data:', authData);

    // 2. Preparar o FormData para o upload
    const formData = new FormData();
    formData.append('file', file);
    formData.append('fileName', file.name);
    formData.append('useUniqueFileName', 'true');
    formData.append('token', authData.token);
    formData.append('signature', authData.signature);
    formData.append('expire', authData.expire);
    formData.append('apiKey', config.publicKey);

    // 3. Fazer o upload para o ImageKit
    console.log('Uploading to ImageKit...');
    const uploadResponse = await fetch(`${config.urlEndpoint}/v1/files/upload`, {
      method: 'POST',
      body: formData
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error('Upload failed:', errorData);
      throw new Error(`Upload failed: ${errorData.message || uploadResponse.statusText}`);
    }

    const result = await uploadResponse.json();
    console.log('Upload successful:', result);
    return result.url;

  } catch (error) {
    console.error('Error in upload process:', error);
    throw error;
  }
}

// ATENÇÃO: Crie um arquivo .env.local na raiz do projeto com:
// VITE_IMAGEKIT_PUBLIC_KEY=sua_public_key_imagekit
// VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/seu_id
// VITE_API_URL=https://seu-dominio.vercel.app 