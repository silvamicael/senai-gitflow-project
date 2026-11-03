const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const repository = require('../src/repositories/taskRepository');
const service = require('../src/services/taskService');
const original = { ...repository };

beforeEach(() => {
  Object.assign(repository, original);
});
afterEach(() => {
  Object.assign(repository, original);
});

test('lista tarefas e formata os dados', async () => {
  repository.list = async () => [{ id: '7', text: 'Estudar', completed: false }];
  assert.deepEqual(await service.list(), [
    { id: 7, text: 'Estudar', completed: false, status: 'Pendente' },
  ]);
});

test('filtra tarefas por status', async () => {
  repository.list = async () => [
    { id: '1', text: 'A', completed: false },
    { id: '2', text: 'B', completed: true },
  ];
  assert.equal((await service.list('Concluida')).length, 1);
  await assert.rejects(() => service.list('invalido'), { statusCode: 400 });
});

test('valida e cria uma tarefa', async () => {
  repository.create = async text => ({ id: '3', text, completed: false });
  await assert.rejects(() => service.create('   '), { statusCode: 400 });
  assert.equal((await service.create('  Nova  ')).text, 'Nova');
});

test('busca e conclui tarefas por ID', async () => {
  repository.findById = async id => id === 9 ? { id: '9', text: 'A', completed: false } : null;
  repository.complete = async id => id === 9 ? { id: '9', text: 'A', completed: true } : null;
  assert.equal((await service.findById('9')).id, 9);
  assert.equal((await service.complete('9')).status, 'Concluida');
  await assert.rejects(() => service.findById('0'), { statusCode: 400 });
  await assert.rejects(() => service.findById('10'), { statusCode: 404 });
});

test('exclui tarefas e retorna 404 caso não existam', async () => {
  repository.remove = async id => id === 2 ? { id: '2', text: 'A', completed: false } : null;
  assert.equal((await service.remove('2')).id, 2);
  await assert.rejects(() => service.remove('3'), { statusCode: 404 });
});
