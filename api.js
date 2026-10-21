const http = require('http');
const { URL } = require('url');
const { todos, addTodo, completeTodo, removeTodo } = require('./index');

const PORT = Number(process.env.PORT) || 3000;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  });
  res.end(JSON.stringify(data));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      if (body.length > 1_000_000) {
        reject(new Error('Corpo da requisição muito grande.'));
        req.destroy();
      }
    });
    req.on('end', () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new SyntaxError('JSON inválido.'));
      }
    });
    req.on('error', reject);
  });
}

function getStatus(todo) {
  return todo.completed ? 'Concluida' : 'Pendente';
}

const server = http.createServer(async (req, res) => {
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    });
    return res.end();
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const path = url.pathname.replace(/\/$/, '') || '/';

  if (req.method === 'GET' && path === '/') {
    return sendJson(res, 200, {
      mensagem: 'API de Lista de Tarefas funcionando!',
      endpoints: [
        'GET /api/tarefas',
        'GET /api/tarefas/:indice',
        'GET /api/tarefas/status/:status',
        'POST /api/tarefas',
        'PATCH /api/tarefas/:indice/concluir',
        'DELETE /api/tarefas/:indice'
      ]
    });
  }

  if (req.method === 'GET' && path === '/health') {
    return sendJson(res, 200, { status: 'ok' });
  }

  if (req.method === 'GET' && path === '/api/tarefas') {
    return sendJson(res, 200, {
      total: todos.length,
      tarefas: todos.map((todo, indice) => ({ indice, text: todo.text, completed: todo.completed, status: getStatus(todo) }))
    });
  }

  const statusMatch = path.match(/^\/api\/tarefas\/status\/(.+)$/);
  if (req.method === 'GET' && statusMatch) {
    const status = decodeURIComponent(statusMatch[1]);
    if (!['Concluida', 'Pendente'].includes(status)) {
      return sendJson(res, 400, { erro: 'Status inválido. Use Concluida ou Pendente.' });
    }
    const tarefas = todos
      .map((todo, indice) => ({ indice, text: todo.text, completed: todo.completed, status: getStatus(todo) }))
      .filter(todo => todo.status === status);
    return sendJson(res, 200, { total: tarefas.length, tarefas });
  }

  const itemMatch = path.match(/^\/api\/tarefas\/(\d+)$/);
  if (req.method === 'GET' && itemMatch) {
    const indice = Number(itemMatch[1]);
    if (indice >= todos.length) return sendJson(res, 404, { erro: 'Tarefa não encontrada.' });
    const todo = todos[indice];
    return sendJson(res, 200, { indice, text: todo.text, completed: todo.completed, status: getStatus(todo) });
  }

  if (req.method === 'POST' && path === '/api/tarefas') {
    try {
      const body = await readBody(req);
      if (typeof body.text !== 'string' || !body.text.trim()) {
        return sendJson(res, 400, { erro: 'Informe o campo "text" com o texto da tarefa.' });
      }
      addTodo(body.text.trim());
      const indice = todos.length - 1;
      return sendJson(res, 201, { mensagem: 'Tarefa criada com sucesso.', indice, tarefa: { ...todos[indice], status: getStatus(todos[indice]) } });
    } catch (error) {
      return sendJson(res, 400, { erro: error.message || 'Não foi possível ler o JSON.' });
    }
  }

  const completeMatch = path.match(/^\/api\/tarefas\/(\d+)\/concluir$/);
  if (req.method === 'PATCH' && completeMatch) {
    const indice = Number(completeMatch[1]);
    if (indice >= todos.length) return sendJson(res, 404, { erro: 'Tarefa não encontrada.' });
    completeTodo(indice);
    return sendJson(res, 200, { mensagem: 'Tarefa concluída.', indice, tarefa: { ...todos[indice], status: getStatus(todos[indice]) } });
  }

  if (req.method === 'DELETE' && itemMatch) {
    const indice = Number(itemMatch[1]);
    if (indice >= todos.length) return sendJson(res, 404, { erro: 'Tarefa não encontrada.' });
    const [removida] = todos.splice(indice, 1);
    return sendJson(res, 200, { mensagem: 'Tarefa removida com sucesso.', tarefa: removida });
  }

  return sendJson(res, 404, { erro: 'Rota não encontrada.' });
});

if (require.main === module) {
  server.listen(PORT, '0.0.0.0', () => {
    console.log(`API de Lista de Tarefas rodando em http://localhost:${PORT}`);
  });
}

module.exports = { server };
