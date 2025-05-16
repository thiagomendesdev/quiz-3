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

const imagekit = new ImageKit({
  publicKey: config.publicKey,
  urlEndpoint: config.urlEndpoint,
  authenticationEndpoint: `${config.apiUrl}/api/imagekit-auth`
});

export async function uploadToImageKit(file) {
  return new Promise((resolve, reject) => {
    console.log('Starting upload to ImageKit...', {
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });
    
    // Verificar se o arquivo é válido
    if (!file || !(file instanceof File)) {
      console.error('Invalid file provided:', file);
      reject(new Error('Invalid file provided'));
      return;
    }

    // Verificar se as configurações do ImageKit estão corretas
    console.log('ImageKit configuration:', {
      publicKey: imagekit.publicKey,
      urlEndpoint: imagekit.urlEndpoint,
      authenticationEndpoint: imagekit.authenticationEndpoint
    });

    imagekit.upload({
      file,
      fileName: file.name,
      useUniqueFileName: true
    }, (err, result) => {
      if (err) {
        console.error('ImageKit upload error:', err);
        reject(err);
        return;
      }
      console.log('Upload successful:', result);
      resolve(result.url);
    });
  });
}

// ATENÇÃO: Crie um arquivo .env.local na raiz do projeto com:
// VITE_IMAGEKIT_PUBLIC_KEY=sua_public_key_imagekit
// VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/seu_id
// VITE_API_URL=https://seu-dominio.vercel.app 