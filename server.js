import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Servir archivos estáticos
app.use(express.static(__dirname));

// Ruta específica para el archivo .m3u8 con el tipo MIME correcto
app.get('/canal.m3u8', (req, res) => {
  res.type('application/vnd.apple.mpegurl');
  res.sendFile(path.join(__dirname, 'canal.m3u8'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
