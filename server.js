import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

// 🌍 CORS pa' que tu streaming sea libre como el viento
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  next()
})

// 🔧 MIME correcto para playlists HLS (.m3u8)
app.get('*.m3u8', (req, res) => {
  res.type('application/vnd.apple.mpegurl')
  res.sendFile(path.join(__dirname, req.path))
})

// 🔧 MIME correcto para segmentos (.ts)
app.get('*.ts', (req, res) => {
  res.type('video/MP2T')
  res.sendFile(path.join(__dirname, req.path))
})

// 📦 Archivos estáticos por si acaso
app.use(express.static(__dirname))

// 🚀 Arrancamos el servidor
app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor corriendo 😎🍿')
})
