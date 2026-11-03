const express = require('express');
const repository = require('./repositories/taskRepository');
const taskRoutes = require('./routes/taskRoutes');

const app = express();
app.disable('x-powered-by');
app.use(express.json({ limit: '16kb' }));

app.get('/', (req, res) => {
  res.json({
    mensagem: 'API de Lista de Tarefas funcionando!',
    endpoints: [
      'GET /health',
      'GET /api/tarefas',
      'GET /api/tarefas/:id',
      'GET /api/tarefas/status/:status',
      'POST /api/tarefas',
      'PATCH /api/tarefas/:id/concluir',
      'DELETE /api/tarefas/:id',
    ],
  });
});

app.get('/health', async (req, res) => {
  try {
    await repository.ping();
    res.json({ status: 'ok', database: 'connected' });
  } catch {
    res.status(503).json({ status: 'error', database: 'unavailable' });
  }
});

app.use('/api/tarefas', taskRoutes);
app.use((req, res) => res.status(404).json({ erro: 'Rota não encontrada.' }));
app.use((error, req, res, next) => {
  if (error.type === 'entity.parse.failed') {
    return res.status(400).json({ erro: 'JSON inválido.' });
  }
  if (error.type === 'entity.too.large') {
    return res.status(413).json({ erro: 'Corpo da requisição muito grande.' });
  }
  if (!error.statusCode) console.error(error);
  return res.status(error.statusCode || 500).json({
    erro: error.statusCode ? error.message : 'Erro interno do servidor.',
  });
});

module.exports = app;
