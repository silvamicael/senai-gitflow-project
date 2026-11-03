#!/usr/bin/env bash
set -euo pipefail

BASE_URL="${BASE_URL:-http://localhost:3000}"
echo '1. Confirmando saúde da API e PostgreSQL...'
curl --fail --silent --show-error "$BASE_URL/health"
echo

echo '2. Criando uma tarefa real...'
response=$(curl --fail --silent --show-error -X POST "$BASE_URL/api/tarefas" \
  -H 'Content-Type: application/json' \
  -d '{"text":"Teste de comunicacao Docker Compose"}')
echo "$response"

echo '3. Lendo tarefas persistidas...'
curl --fail --silent --show-error "$BASE_URL/api/tarefas"
echo

echo '4. Testando DNS e conexão TCP com PostgreSQL de dentro do container da API...'
docker compose exec -T api node -e "const net=require('node:net');const c=net.connect(5432,'db');c.on('connect',()=>{console.log('api -> db:5432 OK');c.end()});c.on('error',e=>{console.error(e);process.exit(1)})"

echo '5. Reiniciando API e confirmando persistência...'
docker compose restart api
for i in $(seq 1 20); do
  if curl --fail --silent "$BASE_URL/health" >/dev/null; then break; fi
  sleep 1
done
curl --fail --silent --show-error "$BASE_URL/api/tarefas"
echo
echo 'OK: comunicação e persistência verificadas.'
