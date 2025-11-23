const express = require('express');
const app = express();

const port = process.env.PORT || 3000;

app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'Backend funcionando desde GitHub CI/CD'
  });
});

app.listen(port, () => {
  console.log("Servidor escuchando en el puerto " + port);
});
