# Modularização API — Documentação

Portal simples que documenta a API de usuários do projeto **Modularizacao**, com modo claro e escuro.

## Como executar

```bash
npm install
npm start
```

O navegador abre em http://localhost:4200.

## Estrutura

```
src/
├── index.html        # página base, contém <app-root>
├── main.ts           # inicia o Angular
├── styles.css        # cores (modo claro e escuro) e estilos globais
└── app/
    ├── api-docs.ts   # DADOS: todos os endpoints documentados
    ├── app.ts        # LÓGICA: signals, tema e funções
    ├── app.html      # TELA: o que aparece no navegador
    └── app.css       # VISUAL do componente
```

Para alterar a porta da API exibida, edite `apiBaseUrl` em `src/app/api-docs.ts`.
