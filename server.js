import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.static(__dirname)) // sirve .ts, .mp4 y demás archivos estáticos

app.get('/canal.m3u8', (req, res) => {
  res.type('application/vnd.apple.mpegurl');
  res.sendFile(path.join(__dirname, 'canal.m3u8'));
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor corriendo 😎')
})
