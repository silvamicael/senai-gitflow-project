const router = require('express').Router();
const tasks = require('../services/taskService');

// Encaminha erros de funções assíncronas para o handler central no app.js.
const asyncRoute = handler => (req, res, next) => {
  Promise.resolve(handler(req, res)).catch(next);
};

router.get('/', asyncRoute(async (req, res) => {
  const tarefas = await tasks.list();
  res.json({ total: tarefas.length, tarefas });
}));

router.get('/status/:status', asyncRoute(async (req, res) => {
  const tarefas = await tasks.list(req.params.status);
  res.json({ total: tarefas.length, tarefas });
}));

router.get('/:id', asyncRoute(async (req, res) => {
  res.json(await tasks.findById(req.params.id));
}));

router.post('/', asyncRoute(async (req, res) => {
  const tarefa = await tasks.create(req.body?.text);
  res.status(201).json({ mensagem: 'Tarefa criada com sucesso.', tarefa });
}));

router.patch('/:id/concluir', asyncRoute(async (req, res) => {
  const tarefa = await tasks.complete(req.params.id);
  res.json({ mensagem: 'Tarefa concluída.', tarefa });
}));

router.delete('/:id', asyncRoute(async (req, res) => {
  const tarefa = await tasks.remove(req.params.id);
  res.json({ mensagem: 'Tarefa removida com sucesso.', tarefa });
}));

module.exports = router;
