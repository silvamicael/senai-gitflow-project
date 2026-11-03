# Task API | Node.js + PostgreSQL

API REST de tarefas, estruturada em **routes → services → repositories** e executada com **Docker Compose** em dois containers: `api` (Node.js) e `db` (PostgreSQL). Sem Nginx, controller ou middleware separado.

## Organização

```text
.
├── src/
│   ├── config/database.js             # Pool de conexões PostgreSQL
│   ├── routes/taskRoutes.js           # Rotas e respostas HTTP
│   ├── services/taskService.js        # Validação e regras de negócio
│   ├── repositories/taskRepository.js # SQL parametrizado
│   ├── app.js                         # Configuração da aplicação
│   └── server.js                      # Inicialização do servidor
├── tests/                             # Testes por camada
├── database/init.sql                  # Criação inicial da tabela
├── scripts/
│   ├── cleanup-legacy.ps1             # Remove arquivos antigos do repositório
│   └── test-compose.sh                # Teste real de comunicação entre containers
├── .github/workflows/test.yml         # Testes automáticos no GitHub
├── Dockerfile
├── docker-compose.yml
├── .env.example
├── .gitignore
├── .dockerignore
├── package.json
├── LINK-DOCKER-COMPOSE.txt
└── README.md
```

Arquivos **removidos**: `api.js`, `index.js`, `index.test.js` e `test/index.test.js` (legados da versão em memória). Não são usados por esta API.

## Inicialização

Requisitos: Docker Desktop com engine Linux. Na pasta que contém `docker-compose.yml`:

```powershell
Copy-Item .env.example .env
# Abra .env e troque a senha antes de iniciar.
docker compose config --quiet
docker compose up -d --build --wait
docker compose ps
Invoke-RestMethod http://localhost:3000/health
```

Esperado: `{"status":"ok","database":"connected"}`. A API expõe a porta 3000; o banco só está acessível pela rede `backend` (`db:5432`). O volume `postgres_data` mantém os dados entre reinícios.

## Endpoints

| Método | Endpoint | Finalidade |
| --- | --- | --- |
| GET | `/health` | Confirma conexão API ↔ banco |
| GET | `/api/tarefas` | Lista tarefas |
| GET | `/api/tarefas/:id` | Busca por ID |
| GET | `/api/tarefas/status/Pendente` | Filtra pendentes |
| GET | `/api/tarefas/status/Concluida` | Filtra concluídas |
| POST | `/api/tarefas` | Cria tarefa com `{ "text": "Estudar" }` |
| PATCH | `/api/tarefas/:id/concluir` | Conclui tarefa |
| DELETE | `/api/tarefas/:id` | Apaga tarefa |

IDs são persistentes e não mudam quando uma tarefa é removida.

## Testes

```powershell
npm install
npm test
```

Para testar a comunicação real, com os containers iniciados, use Git Bash/WSL:

```bash
bash scripts/test-compose.sh
```

O script confirma `/health`, criação e listagem de tarefa, acesso TCP do container `api` a `db:5432`, e dados depois de reiniciar a API. A pipeline `.github/workflows/test.yml` também roda testes e integração Docker.

## Atualizar seu repositório já publicado

1. A partir da branch `feature/docker-compose-postgres` já publicada, crie `refactor/cleanup-task-api`.
2. Copie **o conteúdo** deste projeto para a raiz do repositório (substituindo os arquivos de mesmo nome).
3. Na raiz do repositório, rode `./scripts/cleanup-legacy.ps1` no PowerShell para excluir arquivos antigos rastreados.
4. Confira `git status` e `git diff --stat` antes de criar o commit. **Não apague o projeto `.git/`.**
5. Rode os testes e publique sua branch para Pull Request.

Veja `GUIA-ATIVIDADE.md` para os comandos completos e a entrega do professor.
