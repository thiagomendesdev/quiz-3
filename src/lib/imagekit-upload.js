import { supabase } from './supabase'

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

    // Gerar um nome único para o arquivo
    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`
    const filePath = `${fileName}`

    // Fazer upload para o Supabase Storage
    console.log('Uploading to Supabase Storage...');
    const { data, error } = await supabase.storage
      .from('images') // nome do bucket no Supabase
      .upload(filePath, file)

    if (error) {
      console.error('Upload failed:', error);
      throw new Error(`Upload failed: ${error.message}`);
    }

    // Obter a URL pública do arquivo
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    console.log('Upload successful:', { publicUrl });
    return publicUrl;

  } catch (error) {
    console.error('Error in upload process:', error);
    throw error;
  }
}

// ATENÇÃO: Crie um arquivo .env.local na raiz do projeto com:
// VITE_IMAGEKIT_PUBLIC_KEY=sua_public_key_imagekit
// VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/seu_id
// VITE_API_URL=https://seu-dominio.vercel.app 