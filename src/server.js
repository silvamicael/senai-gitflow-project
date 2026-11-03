const app = require('./app');
const db = require('./config/database');

const port = Number(process.env.PORT || 3000);
const server = app.listen(port, '0.0.0.0', () => {
  console.log(`API disponível na porta ${port}`);
});

process.on('SIGTERM', () => {
  server.close(() => db.end());
});
