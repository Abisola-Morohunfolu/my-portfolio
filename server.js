// server.js
const express = require('express');
const path = require('path');

const app = express();
const clientPath = path.join(__dirname, 'dist');

app.use(express.static(clientPath));
app.get('/{*splat}', (_, res) => {
  res.sendFile(path.join(clientPath, 'index.html'));
});

app.listen(process.env.PORT || 8080);
