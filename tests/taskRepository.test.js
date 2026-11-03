const { test, beforeEach, afterEach } = require('node:test');
const assert = require('node:assert/strict');
const db = require('../src/config/database');
const repository = require('../src/repositories/taskRepository');
const originalQuery = db.query;

beforeEach(() => { db.query = originalQuery; });
afterEach(() => { db.query = originalQuery; });

test('consulta tarefas em ordem por ID', async () => {
  db.query = async sql => {
    assert.match(sql, /ORDER BY id/);
    return { rows: [{ id: '1', text: 'A', completed: false }] };
  };
  assert.equal((await repository.list()).length, 1);
});

test('cria tarefa com parâmetros SQL', async () => {
  db.query = async (sql, params) => {
    assert.match(sql, /VALUES \(\$1\)/);
    assert.deepEqual(params, ['Texto seguro']);
    return { rows: [{ id: '4', text: params[0], completed: false }] };
  };
  assert.equal((await repository.create('Texto seguro')).id, '4');
});

test('conclui e exclui pelo ID', async () => {
  db.query = async (sql, params) => {
    assert.deepEqual(params, [5]);
    return { rows: [{ id: '5', text: 'A', completed: true }] };
  };
  assert.equal((await repository.complete(5)).completed, true);
  assert.equal((await repository.remove(5)).id, '5');
});
