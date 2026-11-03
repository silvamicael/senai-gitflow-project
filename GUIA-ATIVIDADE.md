# Entrega e Git — Atividade Docker Compose

## Branch principal da atividade

`feature/docker-compose-postgres` (criar a partir de `develop` atualizado).

## Commits sugeridos

1. `refactor: organiza API em routes services e repositories`
2. `feat: adiciona PostgreSQL e Docker Compose`
3. `test: adiciona testes da API e integracao Docker`
4. `docs: documenta execucao e entrega da atividade`

O ZIP é uma fotografia do estado final, sem pasta `.git`. Para manter commits separados, aplique as mudanças por etapas. Se substituir tudo de uma vez, use **um único commit verdadeiro**: `feat: reorganiza API com PostgreSQL e Docker Compose`.

## Comandos de publicação (na cópia do repositório Git)

```bash
git checkout develop
git pull origin develop
git checkout -b feature/docker-compose-postgres
# Copie o conteúdo do ZIP para a raiz do repositório.
npm install
npm test
docker compose up -d --build --wait
bash scripts/test-compose.sh
git add -A
git commit -m "feat: reorganiza API com PostgreSQL e Docker Compose"
git push -u origin feature/docker-compose-postgres
```

Abra PR **`feature/docker-compose-postgres` → `develop`**. Depois que a branch estiver publicada, substitua o placeholder de `LINK-DOCKER-COMPOSE.txt` pela URL do GitHub.

## Critérios do professor

1. **Comunicação:** `api` se conecta a `db` pela rede Docker `backend`; `/health` executa SELECT 1.
2. **Link:** `LINK-DOCKER-COMPOSE.txt` contém instrução para registrar a URL do Compose após o push.
3. **Camadas:** rotas recebem HTTP, services cuidam de validação e regras, repositories executam SQL parametrizado.
4. **Organização:** estrutura compacta; erros HTTP centralizados; variáveis em `.env` não versionado.
5. **Testes:** `npm test` executa testes de service, repository e endpoints; o script executa integração real.
6. **Containers:** healthcheck do PostgreSQL, dependência saudável, volume persistente e rede compartilhada.

A prova de funcionamento real precisa ser executada no Docker Desktop ou CI antes da apresentação.
