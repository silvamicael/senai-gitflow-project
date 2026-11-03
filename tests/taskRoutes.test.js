const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');
const service = require('../src/services/taskService');
const repository = require('../src/repositories/taskRepository');
const originalService = { ...service };
const originalRepository = { ...repository };
let server;
let url;

beforeEach(async () => {
  Object.assign(service, originalService);
  Object.assign(repository, originalRepository);
  server = app.listen(0);
  await new Promise(resolve => server.once('listening', resolve));
  url = `http://127.0.0.1:${server.address().port}`;
});
afterEach(async () => {
  Object.assign(service, originalService);
  Object.assign(repository, originalRepository);
  await new Promise((resolve, reject) => server.close(err => err ? reject(err) : resolve()));
});

test('GET /health confirma a conexão simulada', async () => {
  repository.ping = async () => {};
  const response = await fetch(`${url}/health`);
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { status: 'ok', database: 'connected' });
});

test('GET /api/tarefas lista itens', async () => {
  service.list = async () => [{ id: 1, text: 'Tarefa', completed: false, status: 'Pendente' }];
  const response = await fetch(`${url}/api/tarefas`);
  assert.equal(response.status, 200);
  assert.equal((await response.json()).total, 1);
});

test('POST /api/tarefas cria itens', async () => {
  service.create = async text => ({ id: 2, text, completed: false, status: 'Pendente' });
  const response = await fetch(`${url}/api/tarefas`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: 'Estudar' }),
  });
  assert.equal(response.status, 201);
  assert.equal((await response.json()).tarefa.text, 'Estudar');
});

test('PATCH /api/tarefas/:id/concluir conclui itens', async () => {
  service.complete = async () => ({ id: 2, text: 'Estudar', completed: true, status: 'Concluida' });
  const response = await fetch(`${url}/api/tarefas/2/concluir`, { method: 'PATCH' });
  assert.equal(response.status, 200);
  assert.equal((await response.json()).tarefa.completed, true);
});

test('DELETE /api/tarefas/:id exclui itens', async () => {
  service.remove = async () => ({ id: 2, text: 'Estudar', completed: true, status: 'Concluida' });
  const response = await fetch(`${url}/api/tarefas/2`, { method: 'DELETE' });
  assert.equal(response.status, 200);
});

test('rotas desconhecidas retornam 404', async () => {
  const response = await fetch(`${url}/desconhecida`);
  assert.equal(response.status, 404);
});

test('JSON inválido retorna 400', async () => {
  const response = await fetch(`${url}/api/tarefas`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{',
  });
  assert.equal(response.status, 400);
});
