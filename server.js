import express from 'express'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.get('*.ts', (req, res) => {
  const filePath = path.join(__dirname, req.path)
  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Archivo no encontrado 😢')
  }

  const stat = fs.statSync(filePath)
  const fileSize = stat.size
  const range = req.headers.range

  if (!range) {
    // Si no hay rango, manda todo el archivo
    res.writeHead(200, {
      'Content-Length': fileSize,
      'Content-Type': 'video/MP2T',
    })
    fs.createReadStream(filePath).pipe(res)
  } else {
    // Parsear rango
    const parts = range.replace(/bytes=/, '').split('-')
    const start = parseInt(parts[0], 10)
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1

    if (start >= fileSize || end >= fileSize) {
      // Rango inválido
      res.writeHead(416, {
        'Content-Range': `bytes */${fileSize}`
      })
      return res.end()
    }

    const chunkSize = (end - start) + 1

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/MP2T',
    })

    const stream = fs.createReadStream(filePath, { start, end })
    stream.pipe(res)
  }
})

// Para el .m3u8 sí solo envías el archivo estático como antes:
app.get('*.m3u8', (req, res) => {
  res.type('application/vnd.apple.mpegurl')
  res.sendFile(path.join(__dirname, req.path))
})

app.use(express.static(__dirname))

app.listen(3000, () => console.log('Servidor streaming alive! 🚀'))
