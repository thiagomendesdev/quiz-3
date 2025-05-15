import ImageKit from 'imagekitio-js'

const imagekit = new ImageKit({
  publicKey: import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY, // Defina no .env.local
  urlEndpoint: import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT, // Defina no .env.local
  authenticationEndpoint: '/api/imagekit-auth' // Você deve criar esse endpoint no backend
})

export async function uploadToImageKit(file) {
  return new Promise((resolve, reject) => {
    imagekit.upload({
      file,
      fileName: file.name
    }, (err, result) => {
      if (err) return reject(err)
      resolve(result.url)
    })
  })
}

// ATENÇÃO: Crie um arquivo .env.local na raiz do projeto com:
// VITE_IMAGEKIT_PUBLIC_KEY=sua_public_key_imagekit
// VITE_IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/seu_id 