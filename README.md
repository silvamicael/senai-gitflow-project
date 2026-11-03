# Task API — Docker Compose + PostgreSQL

API REST de gerenciamento de tarefas desenvolvida com Node.js, Express e PostgreSQL.

O projeto utiliza Docker Compose para executar a aplicação e o banco de dados em containers separados, com arquitetura em camadas.

## Tecnologias

- Node.js e Express
- PostgreSQL 17
- Docker e Docker Compose
- Node.js Test Runner
- GitHub Actions

## Estrutura do projeto

```text
src/
├── config/
│   └── database.js
├── routes/
│   └── taskRoutes.js
├── services/
│   └── taskService.js
├── repositories/
│   └── taskRepository.js
├── app.js
└── server.js

database/
└── init.sql

tests/
scripts/
Dockerfile
docker-compose.yml
.env.example
package.json
README.md
```

## Arquitetura

A aplicação está dividida em três camadas:

- **Routes:** recebem requisições HTTP e retornam respostas.
- **Services:** implementam validações e regras de negócio.
- **Repositories:** executam operações SQL no PostgreSQL.

A comunicação ocorre entre dois containers:

**Cliente → API Node.js → PostgreSQL**

O Docker Compose configura a rede interna automaticamente. A API acessa o banco pelo hostname `db`.

## Executando com Docker

Crie o arquivo de ambiente:

```powershell
Copy-Item .env.example .env
```

Altere a senha de exemplo no `.env`.

Inicie os containers:

```powershell
docker compose up -d --build --wait
```

Verifique os serviços:

```powershell
docker compose ps
```

Acesse:

`http://localhost:3000`

## Endpoints

| Método | Endpoint | Descrição |
|---|---|---|
| GET | `/` | Informações da API |
| GET | `/health` | Verifica API e banco |
| GET | `/api/tarefas` | Lista tarefas |
| GET | `/api/tarefas/:id` | Consulta uma tarefa |
| GET | `/api/tarefas/status/:status` | Filtra por status |
| POST | `/api/tarefas` | Cria uma tarefa |
| PATCH | `/api/tarefas/:id/concluir` | Conclui uma tarefa |
| DELETE | `/api/tarefas/:id` | Remove uma tarefa |

Exemplo de criação:

```json
{
  "text": "Estudar Docker Compose"
}
```

## Testes

Para executar os testes automatizados:

```powershell
npm install
npm test
```

Para testar a comunicação real entre os containers, utilize o Git Bash:

```bash
bash scripts/test-compose.sh
```

O script verifica a conexão com o banco, operações da API e persistência após reiniciar o container.

## Persistência

O banco PostgreSQL utiliza o volume `postgres_data`, garantindo que os registros continuem armazenados após reiniciar os containers.

## Integração contínua

O GitHub Actions executa os testes automatizados e os testes de integração usando Docker Compose.

## Atividade SENAI

O projeto demonstra:

1. Comunicação entre containers.
2. Docker Compose configurado.
3. Arquitetura Routes, Services e Repositories.
4. Organização e boas práticas.
5. Testes automatizados.
6. Persistência e integração dos serviços.