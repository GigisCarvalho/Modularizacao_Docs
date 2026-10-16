# Modularização API — Documentação

Portal web para consultar a documentação da **API de usuários do projeto Modularização** (Node.js, Express e MySQL).

Feito em **Angular** para servir também como material de estudo.

## Funcionalidades

- **Home** com a URL base, a lista de endpoints e os status HTTP usados pela API
- **Página de cada endpoint** com:
  - método e rota, com botão para copiar
  - regras e observações
  - parâmetros de rota, query string e body, com tipo e regras de validação
  - exemplo de requisição em **HTTP** ou **cURL**, com botão para copiar
  - resposta de sucesso e respostas de erro (abrem e fecham)
- **Busca** de endpoints no menu lateral
- **Modo claro e escuro**, com a escolha salva no navegador
- **Layout responsivo**: no celular, o menu vira uma gaveta aberta pelo botão ☰

## Tecnologias

| Tecnologia | Uso |
|---|---|
| Angular | Framework do front-end |
| TypeScript | Linguagem do código |
| Signals (`signal`, `computed`) | Estado da tela |
| Control flow (`@if`, `@for`) | Condições e repetições no HTML |
| CSS com variáveis | Cores dos temas claro e escuro |

## Pré-requisitos

- [Node.js](https://nodejs.org/) **20.19 ou superior**
- npm (já vem com o Node.js)

Para conferir as versões instaladas:

```bash
node -v
npm -v
```

## Como executar

```bash
# 1. Clone o repositório
git clone <url-do-repositorio>

# 2. Entre na pasta
cd modularizacao-docs

# 3. Instale as dependências (só na primeira vez)
npm install

# 4. Rode o projeto
npm start
```

O navegador abre em **http://localhost:4200**.

## Estrutura do projeto

```
modularizacao-docs/
├── public/
│   └── favicon.svg       # ícone da aba do navegador
├── src/
│   ├── index.html        # página base, contém <app-root>
│   ├── main.ts           # ponto de entrada: inicia o Angular
│   ├── styles.css        # cores dos temas claro/escuro e estilos globais
│   └── app/
│       ├── api-docs.ts   # DADOS: todos os endpoints documentados
│       ├── app.ts        # LÓGICA: signals, tema e funções
│       ├── app.html      # TELA: o que aparece no navegador
│       └── app.css       # VISUAL do componente
├── angular.json          # configuração do Angular CLI
├── package.json          # dependências e scripts
└── tsconfig.json         # configuração do TypeScript
```

> **Sugestão de ordem de estudo:** `api-docs.ts` → `app.ts` → `app.html` → `app.css`

## Endpoints documentados

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/` | Criar usuário |
| `GET` | `/` | Consultar registros (paginado) |
| `GET` | `/is_active/:active` | Consultar registros pelo ativo (paginado) |
| `GET` | `/:id` | Consultar registro pelo id |
| `GET` | `/search` | Consultar registros pelo nome ou e-mail (paginado) |
| `PUT` | `/:id` | Atualizar registro pelo id |
| `DELETE` | `/:id` | Deletar registro pelo id |

## Personalização

### Alterar a URL da API

No arquivo `src/app/api-docs.ts`:

```ts
export const apiBaseUrl = 'http://localhost:3000/modularizacao';

Use a mesma porta definida no `.env` do backend.

### Documentar um novo endpoint

Adicione um objeto na lista `endpoints` em `src/app/api-docs.ts`. O menu, a busca e as páginas são atualizados sozinhos:

```ts
{
  id: 'meu-endpoint',             // identificador único
  title: 'Título do endpoint',
  method: 'GET',                  // GET, POST, PUT ou DELETE
  path: '/minha-rota',
  exampleUrl: '/minha-rota',
  description: 'O que o endpoint faz.',
  success: { status: 200, title: 'Sucesso', body: '{ "ok": true }' },
  errors: [],
}
```

## Autora

Desenvolvido por Giovanna Barbosa de Carvalho, com auxilio de IA, como projeto de estudo.