const db = require('../config/database');

async function list() {
  const { rows } = await db.query('SELECT id, text, completed FROM tasks ORDER BY id');
  return rows;
}

async function findById(id) {
  const { rows } = await db.query('SELECT id, text, completed FROM tasks WHERE id = $1', [id]);
  return rows[0] || null;
}

async function create(text) {
  const { rows } = await db.query(
    'INSERT INTO tasks (text) VALUES ($1) RETURNING id, text, completed',
    [text],
  );
  return rows[0];
}

async function complete(id) {
  const { rows } = await db.query(
    'UPDATE tasks SET completed = TRUE WHERE id = $1 RETURNING id, text, completed',
    [id],
  );
  return rows[0] || null;
}

async function remove(id) {
  const { rows } = await db.query(
    'DELETE FROM tasks WHERE id = $1 RETURNING id, text, completed',
    [id],
  );
  return rows[0] || null;
}

async function ping() {
  await db.query('SELECT 1');
}

module.exports = { list, findById, create, complete, remove, ping };
