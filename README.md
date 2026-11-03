# API de Tarefas — Docker Compose + PostgreSQL

Atividade SENAI com **dois containers** (Node.js e PostgreSQL) e **três camadas** (`routes`, `services`, `repositories`). Sem Nginx, controllers ou middlewares próprios.

## Estrutura

```text
src/
├── config/database.js
├── routes/taskRoutes.js
├── services/taskService.js
├── repositories/taskRepository.js
├── app.js
└── server.js
database/init.sql
tests/
scripts/test-compose.sh
docker-compose.yml
Dockerfile
```

## Executar (PowerShell)

```powershell
Copy-Item .env.example .env
# Edite .env e altere POSTGRES_PASSWORD antes de iniciar.
docker compose config --quiet
docker compose up -d --build --wait
docker compose ps
Invoke-RestMethod http://localhost:3000/health
```

## Endpoints

| Método | Rota | Objetivo |
| --- | --- | --- |
| GET | `/` | Documentação resumida |
| GET | `/health` | Saúde API/banco |
| GET | `/api/tarefas` | Listar |
| GET | `/api/tarefas/:id` | Consultar por ID |
| GET | `/api/tarefas/status/Pendente` | Filtrar pendentes |
| GET | `/api/tarefas/status/Concluida` | Filtrar concluídas |
| POST | `/api/tarefas` | Criar (`{"text":"Estudar"}`) |
| PATCH | `/api/tarefas/:id/concluir` | Concluir |
| DELETE | `/api/tarefas/:id` | Excluir |

> **Mudança em relação ao projeto original:** as rotas de tarefas agora usam IDs persistentes (`:id`), em vez de índices transitórios (`:indice`). Os dados são salvos no PostgreSQL.

## Teste rápido (PowerShell)

```powershell
Invoke-RestMethod -Method POST -Uri http://localhost:3000/api/tarefas -ContentType 'application/json' -Body '{"text":"Estudar Docker"}'
Invoke-RestMethod http://localhost:3000/api/tarefas
Invoke-RestMethod http://localhost:3000/health
```

## Testes

```powershell
npm install
npm test
```

Teste de integração real (Git Bash ou WSL), após `docker compose up`:

```bash
bash scripts/test-compose.sh
```

Os testes unitários não exigem banco, pois simulam as respostas das dependências. O script de integração exige Docker e PostgreSQL reais.

## Como demonstrar os containers

1. `docker compose ps` mostra `api` e `db`.
2. `docker compose exec api node -e "require('node:net').connect(5432,'db').on('connect',()=>{console.log('OK');process.exit()})"` mostra que a API resolve o nome `db` e abre conexão TCP.
3. `/health` confirma a consulta SQL com o PostgreSQL.
4. Crie uma tarefa e liste-a.
5. `docker compose restart api` e liste novamente para demonstrar persistência.
6. `docker compose logs -f api db` mostra logs dos dois containers.

A porta do PostgreSQL não é publicada no host; somente a API usa a rede interna `backend`.

## Entrega

Depois de fazer push da branch `feature/docker-compose-postgres`, copie a URL **real** do arquivo `docker-compose.yml` no GitHub para `LINK-DOCKER-COMPOSE.txt`. Não confunda URL local com URL publicada.

Veja também `GUIA-ATIVIDADE.md` para commits e roteiro da apresentação.
