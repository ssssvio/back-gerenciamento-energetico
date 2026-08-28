# Backend — Gerenciamento Energético Escolar

API em Node.js/Express para gerenciamento do consumo energético de uma escola
(Papagaios-MG), permitindo consultar e cadastrar consumo por setor, comparar
gastos antes/depois da implementação de energia solar e abrir chamados de
suporte técnico, manutenção e melhorias.

> Projeto acadêmico (UNINTER — Atividade Extensionista). Não utiliza banco de
> dados: os dados ficam em memória durante a execução e são espelhados em um
> arquivo JSON (`data/store.json`) para não se perderem ao reiniciar o servidor.

## Requisitos

- Node.js 18 ou superior

## Como rodar

```bash
cd backend
npm install
copy .env.example .env    # no Windows (ou "cp .env.example .env" no Linux/Mac)
npm run dev                # http://localhost:3000, com reinício automático (nodemon)
# ou
npm start                  # sem reinício automático
```

Na primeira execução, `data/store.json` é criado automaticamente a partir de
`data/seed.json` (dados fictícios de exemplo). Para resetar os dados para o
estado inicial, basta apagar `data/store.json` e reiniciar o servidor.

## Variáveis de ambiente (`.env`)

| Variável          | Descrição                                              | Padrão                  |
| ----------------- | ------------------------------------------------------- | ------------------------ |
| `PORT`            | Porta em que a API sobe                                 | `3000`                   |
| `FRONTEND_ORIGIN` | Origem liberada no CORS (URL do frontend)                | `http://localhost:5500`  |
| `DATA_FILE`       | Caminho alternativo para o arquivo de persistência JSON  | `data/store.json`        |

## Modelo de dados

### Setor (fixo, seedado)
```json
{ "id": "salas-aula", "nome": "Salas de Aula" }
```
Setores disponíveis: `salas-aula`, `lab-informatica`, `biblioteca`, `cozinha`,
`quadra`, `administracao`, `iluminacao-externa`.

### Registro de consumo
```json
{
  "id": "uuid",
  "setorId": "salas-aula",
  "mes": "2025-08",
  "kwh": 599,
  "custo": 491.18,
  "criadoEm": "2025-08-05T00:00:00.000Z"
}
```

### Chamado
```json
{
  "id": "uuid",
  "titulo": "Lâmpadas queimadas na quadra",
  "descricao": "...",
  "categoria": "Manutenção elétrica",
  "setorId": "quadra",
  "prioridade": "media",
  "status": "aberto",
  "dataAbertura": "2026-08-05T09:00:00.000Z",
  "dataAtualizacao": "2026-08-05T09:00:00.000Z"
}
```
- `categoria`: `Suporte técnico` | `Manutenção elétrica` | `Melhoria de rede/monitoramento`
- `prioridade`: `baixa` | `media` | `alta`
- `status`: `aberto` | `em_andamento` | `concluido`

### Configuração
```json
{
  "estabelecimento": { "nome": "Escola Municipal Modelo", "municipio": "Papagaios-MG" },
  "dataImplementacaoSolar": "2025-01"
}
```
`dataImplementacaoSolar` (formato `AAAA-MM`) é usada para separar os registros
de consumo em "antes" (`mes < dataImplementacaoSolar`) e "depois"
(`mes >= dataImplementacaoSolar`) no comparativo.

## Endpoints

### Setores
- `GET /api/setores` — lista todos os setores.

### Consumo
- `GET /api/consumos` — lista registros de consumo.
  - Query params opcionais: `setorId`, `de` (AAAA-MM), `ate` (AAAA-MM).
- `POST /api/consumos` — cria um novo registro.
  - Body: `{ "setorId": "cozinha", "mes": "2026-07", "kwh": 600, "custo": 480 }`
- `GET /api/consumos/comparativo` — retorna o comparativo antes/depois da
  solar (geral e por setor): totais, médias mensais, % de variação e economia
  mensal estimada.

### Chamados
- `GET /api/chamados` — lista chamados.
  - Query params opcionais: `status`, `categoria`, `setorId`.
- `POST /api/chamados` — abre um novo chamado (sempre criado com `status: "aberto"`).
  - Body: `{ "titulo": "...", "descricao": "...", "categoria": "Suporte técnico", "setorId": "salas-aula", "prioridade": "media" }`
- `PATCH /api/chamados/:id` — atualiza `status` e/ou `prioridade` de um chamado.
  - Body: `{ "status": "em_andamento" }`

### Configuração
- `GET /api/config` — retorna a configuração atual.
- `PUT /api/config` — atualiza a data de implementação da solar.
  - Body: `{ "dataImplementacaoSolar": "2025-03" }`

Todas as respostas de erro seguem o formato `{ "erro": "mensagem" }` com o
status HTTP apropriado (400 para validação, 404 para não encontrado, 500 para
erro interno).

## Estrutura de pastas

```
backend/
├── data/
│   ├── seed.json     # dados fictícios versionados (fonte inicial)
│   └── store.json    # gerado em runtime, gitignored (estado atual em memória)
├── src/
│   ├── controllers/  # regras de validação e orquestração por recurso
│   ├── middlewares/   # tratamento de erro/404
│   ├── routes/        # definição das rotas Express
│   ├── services/      # lógica pura (cálculo do comparativo antes/depois)
│   ├── store/          # jsonStore.js — carga/persistência do "banco" em JSON
│   ├── app.js          # configuração do Express (middlewares e rotas)
│   └── server.js       # bootstrap (lê .env, inicia o store, sobe o servidor)
├── .env.example
└── package.json
```
