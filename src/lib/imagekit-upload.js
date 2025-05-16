import ImageKit from 'imagekit-javascript'

// Log das variáveis de ambiente do frontend
console.log('Frontend ImageKit config:', {
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY ? 'Set' : 'Not set',
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT ? 'Set' : 'Not set',
  authEndpoint: import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api/imagekit-auth` : 'Not set'
});

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT,
  authenticationEndpoint: `${import.meta.env.VITE_API_URL}/api/imagekit-auth`
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