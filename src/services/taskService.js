const repository = require('../repositories/taskRepository');

function failure(statusCode, message) {
  return Object.assign(new Error(message), { statusCode });
}

function parseId(value) {
  if (!/^[1-9]\d*$/.test(String(value))) throw failure(400, 'ID inválido.');
  const id = Number(value);
  if (!Number.isSafeInteger(id)) throw failure(400, 'ID inválido.');
  return id;
}

function present(task) {
  return {
    id: Number(task.id),
    text: task.text,
    completed: task.completed,
    status: task.completed ? 'Concluida' : 'Pendente',
  };
}

async function list(status) {
  if (status !== undefined && !['Concluida', 'Pendente'].includes(status)) {
    throw failure(400, 'Status inválido. Use Concluida ou Pendente.');
  }
  const tasks = (await repository.list()).map(present);
  return status ? tasks.filter(task => task.status === status) : tasks;
}

async function findById(rawId) {
  const task = await repository.findById(parseId(rawId));
  if (!task) throw failure(404, 'Tarefa não encontrada.');
  return present(task);
}

async function create(text) {
  if (typeof text !== 'string' || !text.trim() || text.trim().length > 500) {
    throw failure(400, 'Informe "text" com 1 a 500 caracteres.');
  }
  return present(await repository.create(text.trim()));
}

async function complete(rawId) {
  const task = await repository.complete(parseId(rawId));
  if (!task) throw failure(404, 'Tarefa não encontrada.');
  return present(task);
}

async function remove(rawId) {
  const task = await repository.remove(parseId(rawId));
  if (!task) throw failure(404, 'Tarefa não encontrada.');
  return present(task);
}

module.exports = { list, findById, create, complete, remove };
