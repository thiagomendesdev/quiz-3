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

    // Preparar o FormData para o upload
    const formData = new FormData();
    formData.append('file', file);

    // Fazer o upload através do nosso backend
    console.log('Uploading file...');
    const uploadResponse = await fetch(`${config.apiUrl}/api/imagekit-upload`, {
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