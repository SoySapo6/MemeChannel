import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(express.static(__dirname)) // sirve los .ts y .m3u8

app.get('/', (req, res) => {
  res.send(`<video src="/canal.m3u8" controls autoplay></video>`)
})

app.listen(process.env.PORT || 3000, () => {
  console.log('Servidor corriendo 😎')
})