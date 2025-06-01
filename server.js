import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.get('/video.ts', (req, res) => {
  const filePath = path.join(__dirname, 'video.ts')
  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.range

  if (!range) {
    // Si no hay rango, manda todo el archivo (menos ideal para streaming)
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/MP2T',
    })
    fs.createReadStream(filePath).pipe(res)
  } else {
    // Si hay rango, parsea los bytes que pide el cliente
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
    const chunkSize = end - start + 1

    // Headers para decirle que está enviando solo un chunk
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/MP2T',
    })

    // Stream del chunk pedido
    const stream = fs.createReadStream(filePath, { start, end })
    stream.pipe(res)
  }
})

app.listen(3000, () => console.log('Servidor streaming alive! 🚀'))
