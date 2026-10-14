# SENAI Gitflow — API de Lista de Tarefas

A aplicação original de lista de tarefas foi mantida: as funções `addTodo`, `listTodos`, `completeTodo`, `removeTodo` e `listByStatus` continuam disponíveis em `index.js`. Foi adicionada uma API HTTP usando o módulo nativo `http` do Node.js, sem dependências adicionais.

## Requisitos
- Node.js 18 ou superior
- npm

## Executar localmente
```bash
npm install
npm start
```
A API inicia em `http://localhost:3000`. Para executar o comportamento original via terminal, use `npm run start:cli`.

## Rotas
| Método | Rota | Descrição |
|---|---|---|
| GET | `/` | Informações da API e lista de rotas |
| GET | `/health` | Verificação de saúde |
| GET | `/api/tarefas` | Lista todas as tarefas |
| GET | `/api/tarefas/:indice` | Consulta uma tarefa pelo índice (começa em 0) |
| GET | `/api/tarefas/status/Pendente` | Lista tarefas pendentes |
| GET | `/api/tarefas/status/Concluida` | Lista tarefas concluídas |
| POST | `/api/tarefas` | Cria uma tarefa |
| PATCH | `/api/tarefas/:indice/concluir` | Conclui uma tarefa |
| DELETE | `/api/tarefas/:indice` | Remove uma tarefa |

### Criar tarefa
Requisição `POST /api/tarefas`, com `Content-Type: application/json`:
```json
{
  "text": "Estudar Docker"
}
```

### Exemplos com curl
```bash
curl http://localhost:3000/api/tarefas
curl -X POST http://localhost:3000/api/tarefas -H "Content-Type: application/json" -d "{\"text\":\"Estudar Docker\"}"
curl -X PATCH http://localhost:3000/api/tarefas/0/concluir
curl -X DELETE http://localhost:3000/api/tarefas/0
```

## Testes
```bash
npm test
npm run test:coverage
```

## Docker
```bash
docker build -t minha-api:1.0 .
docker run --rm -p 3000:3000 minha-api:1.0
```

Os dados ficam em memória e são apagados quando o processo reinicia. Para persistência entre reinicializações, será necessário adicionar um banco de dados.
