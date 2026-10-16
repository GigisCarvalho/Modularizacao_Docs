/*
  ARQUIVO DE DADOS (catálogo da documentação)
  -------------------------------------------
  Aqui ficam TODAS as informações das APIs.
  O componente (app.ts / app.html) só lê estes dados e mostra na tela.
  Para documentar um novo endpoint, basta adicionar um objeto na lista "endpoints".
*/

// Tipos possíveis de método HTTP usados na API.
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

// Endereço base da API. Troque a porta pela PORT do seu arquivo .env do backend.
export const apiBaseUrl = 'http://localhost:3000/modularizacao';

// Formato de um campo (parâmetro de rota, query string ou body).
export interface ApiField {
  name: string;        // nome do campo
  type: string;        // tipo (string, inteiro, data...)
  required: boolean;   // obrigatório ou não
  rules: string;       // regras de validação em texto
}

// Formato de uma resposta (sucesso ou erro).
export interface ApiResponse {
  status: number;      // código HTTP (200, 400, 404...)
  title: string;       // quando acontece
  body: string;        // exemplo do JSON retornado
}

// Formato de um endpoint completo.
export interface ApiEndpoint {
  id: string;                 // identificador único (usado na navegação)
  title: string;              // nome amigável
  method: HttpMethod;         // GET, POST, PUT ou DELETE
  path: string;               // caminho a partir da base URL
  description: string;        // explicação curta
  params?: ApiField[];        // parâmetros de rota (ex.: :id)
  query?: ApiField[];         // parâmetros da query string (ex.: ?page=1)
  body?: ApiField[];          // campos do corpo JSON
  bodyExample?: string;       // exemplo de corpo para copiar
  exampleUrl: string;         // caminho usado no exemplo de requisição
  notes?: string[];           // observações importantes
  success: ApiResponse;       // resposta de sucesso
  errors: ApiResponse[];      // respostas de erro
}

/* ---------- Pedaços reaproveitados em vários endpoints ---------- */

// Paginação: usada nas listagens.
const pagination: ApiField[] = [
  { name: 'page', type: 'inteiro', required: false, rules: 'Maior que zero. Padrão: 1.' },
  { name: 'limit', type: 'inteiro', required: false, rules: 'Maior que quatro (mínimo 5). Padrão: 10.' },
];

// Parâmetro :id usado em consultar, atualizar e deletar.
const idParam: ApiField[] = [
  { name: 'id', type: 'inteiro', required: true, rules: 'Inteiro maior que zero.' },
];

// Exemplo de um usuário como vem do banco.
const userExample = {
  id: 1,
  nome: 'Ana Beatriz Martins',
  email: 'ana.martins@example.com',
  telefone: '11990000001',
  data_nascimento: '1995-03-12T03:00:00.000Z',
  cidade: 'São Paulo',
  estado: 'SP',
  cargo: 'Analista administrativa',
  ativo: 1,
  criado_em: '2026-10-16T12:00:00.000Z',
  atualizado_em: '2026-10-16T12:00:00.000Z',
};

// Resposta padrão das listagens paginadas.
const listResponse = JSON.stringify({
  users: [userExample],
  paginationConfig: { page: 1, limit: 10, totalRows: 50, totalPages: 5, LastPage: null, NextPage: 2 },
}, null, 2);

// Função que monta um erro de validação no formato do express-validator.
function validationError(value: string, msg: string, path: string, location: string): string {
  return JSON.stringify({ errors: [{ type: 'field', value, msg, path, location }] }, null, 2);
}

// Erros que se repetem.
const pageError: ApiResponse = {
  status: 400, title: 'page ou limit inválidos',
  body: validationError('2', 'O limite deve ser um número inteiro maior que 4.', 'limit', 'query'),
};
const idError: ApiResponse = {
  status: 400, title: 'id inválido',
  body: validationError('0', 'O id deve ser um número inteiro maior que zero.', 'id', 'params'),
};
const notFoundList: ApiResponse = {
  status: 404, title: 'Nenhum registro encontrado ou página não encontrada',
  body: '{\n  "error": "Nenhum usuário encontrado"\n}\n\nou\n\n{\n  "error": "Esta página não encontrada"\n}',
};
const internalError = (message: string): ApiResponse => ({
  status: 500, title: 'Falha interna', body: JSON.stringify({ error: message }, null, 2),
});

/* ---------- Lista de endpoints (ordem do menu) ---------- */

export const endpoints: ApiEndpoint[] = [
  {
    id: 'criar',
    title: 'Criar usuário',
    method: 'POST',
    path: '/',
    exampleUrl: '/',
    description: 'Cadastra um novo usuário. Todos os campos são obrigatórios.',
    body: [
      { name: 'nome', type: 'string', required: true, rules: 'Mínimo 3 caracteres. Apenas letras e espaços.' },
      { name: 'email', type: 'string', required: true, rules: 'De 6 a 255 caracteres, formato de e-mail válido e que não esteja em uso.' },
      { name: 'telefone', type: 'inteiro positivo', required: true, rules: 'Exatamente 11 dígitos e que não esteja em uso.' },
      { name: 'data_nascimento', type: 'data', required: true, rules: 'Formato de data válido (AAAA-MM-DD).' },
      { name: 'cidade', type: 'string', required: true, rules: 'De 5 a 255 caracteres. Apenas letras e espaços.' },
      { name: 'estado', type: 'string', required: true, rules: 'Exatamente 2 letras (ex.: SP).' },
      { name: 'cargo', type: 'string', required: true, rules: 'De 5 a 255 caracteres. Apenas letras e espaços.' },
      { name: 'ativo', type: 'inteiro', required: true, rules: 'Somente 0 (inativo) ou 1 (ativo).' },
    ],
    bodyExample: JSON.stringify({
      nome: 'Ana Souza', email: 'ana@email.com', telefone: '11999999999', data_nascimento: '1998-05-20',
      cidade: 'São Paulo', estado: 'SP', cargo: 'Desenvolvedora', ativo: 1,
    }, null, 2),
    notes: ['E-mail ou telefone já cadastrados são recusados na validação e retornam 400.'],
    success: { status: 201, title: 'Usuário criado', body: JSON.stringify({ id: 51, nome: 'Ana Souza', email: 'ana@email.com' }, null, 2) },
    errors: [
      { status: 400, title: 'Body inválido', body: validationError('email-invalido', 'Email inválido.', 'email', 'body') },
      internalError('Erro ao criar usuário.'),
    ],
  },
  {
    id: 'listar',
    title: 'Consultar registros',
    method: 'GET',
    path: '/',
    exampleUrl: '/?page=1&limit=10',
    description: 'Lista todos os usuários com paginação.',
    query: pagination,
    success: { status: 200, title: 'Lista retornada', body: listResponse },
    errors: [pageError, notFoundList, internalError('Erro ao listar os usuários.')],
  },
  {
    id: 'ativos',
    title: 'Consultar registros pelo ativo',
    method: 'GET',
    path: '/is_active/:active',
    exampleUrl: '/is_active/1?page=1&limit=10',
    description: 'Lista os usuários ativos (1) ou inativos (0), com paginação.',
    params: [{ name: 'active', type: 'inteiro', required: true, rules: 'Somente 0 ou 1.' }],
    query: pagination,
    success: { status: 200, title: 'Lista retornada', body: listResponse },
    errors: [
      pageError,
      { status: 400, title: 'active inválido', body: validationError('2', 'O ativo deve ser um boleano: 1 ou 0.', 'active', 'params') },
      notFoundList,
      internalError('Erro ao listar os usuários.'),
    ],
  },
  {
    id: 'consultar-id',
    title: 'Consultar registro pelo id',
    method: 'GET',
    path: '/:id',
    exampleUrl: '/1',
    description: 'Retorna um único usuário pelo id.',
    params: idParam,
    success: { status: 200, title: 'Usuário encontrado', body: JSON.stringify(userExample, null, 2) },
    errors: [
      idError,
      { status: 404, title: 'Nenhum registro encontrado', body: '{\n  "erro": "Usuário não encontrado"\n}' },
      internalError('Erro ao buscar usuário.'),
    ],
  },
  {
    id: 'pesquisar',
    title: 'Consultar registros pelo nome ou e-mail',
    method: 'GET',
    path: '/search',
    exampleUrl: '/search?page=1&limit=10',
    description: 'Pesquisa usuários por parte do nome e/ou do e-mail, com paginação.',
    query: pagination,
    body: [
      { name: 'nome', type: 'string', required: false, rules: 'Parte do nome. Apenas letras e espaços.' },
      { name: 'email', type: 'string', required: false, rules: 'Parte do e-mail.' },
    ],
    bodyExample: JSON.stringify({ nome: 'Ana', email: '@example' }, null, 2),
    notes: [
      'Envie pelo menos um dos campos: nome ou email.',
      'A pesquisa é parcial (LIKE): "Ana" encontra "Ana Beatriz" e "Mariana".',
      'Os filtros vão no body de uma requisição GET. Funciona no Postman, mas navegadores não enviam body em GET.',
    ],
    success: { status: 200, title: 'Lista retornada', body: listResponse },
    errors: [
      pageError,
      { status: 400, title: 'nome ou email inválido', body: validationError('Ana1', 'O nome deve possuir apenas letras.', 'nome', 'body') },
      { status: 400, title: 'Nem nome nem email enviados', body: validationError('', 'Pesquisa inválida: Informe parcialmente o nome e/ou email para realizar a consulta.', '', 'body') },
      notFoundList,
      internalError('Erro ao buscar usuário'),
    ],
  },
  {
    id: 'atualizar',
    title: 'Atualizar registro pelo id',
    method: 'PUT',
    path: '/:id',
    exampleUrl: '/1',
    description: 'Atualiza somente os campos enviados. Os campos não enviados continuam iguais.',
    params: idParam,
    body: [
      { name: 'email', type: 'string', required: false, rules: 'De 6 a 255 caracteres, formato válido e que não esteja em uso.' },
      { name: 'telefone', type: 'inteiro positivo', required: false, rules: 'Exatamente 11 dígitos e que não esteja em uso.' },
      { name: 'cargo', type: 'string', required: false, rules: 'De 5 a 255 caracteres. Apenas letras e espaços.' },
      { name: 'ativo', type: 'inteiro', required: false, rules: 'Somente 0 ou 1.' },
    ],
    bodyExample: JSON.stringify({ email: 'novoemail@email.com', cargo: 'Analista de Sistemas' }, null, 2),
    notes: ['Envie pelo menos um dos campos: email, telefone, cargo ou ativo.'],
    success: { status: 200, title: 'Usuário atualizado', body: '{\n  "mensagem": "Atualizado com sucesso"\n}' },
    errors: [
      idError,
      { status: 400, title: 'Body inválido', body: validationError('123', 'O telefone deve possuir 11 caracteres.', 'telefone', 'body') },
      { status: 400, title: 'Body vazio ou sem nenhum dos campos', body: validationError('', 'Atualização inválida: informe email, telefone, cargo ou ativo.', '', 'body') },
      { status: 404, title: 'Nenhum registro encontrado', body: '{\n  "error": "Usuário não encontrado."\n}' },
      { status: 409, title: 'E-mail ou telefone já em uso', body: '{\n  "error": "Atualização inválida: O email informado já está em uso."\n}' },
      internalError('Erro ao atualizar usuário'),
    ],
  },
  {
    id: 'deletar',
    title: 'Deletar registro pelo id',
    method: 'DELETE',
    path: '/:id',
    exampleUrl: '/1',
    description: 'Remove definitivamente o usuário do id informado.',
    params: idParam,
    success: { status: 200, title: 'Usuário removido', body: '{\n  "mensagem": "Removido com sucesso"\n}' },
    errors: [
      idError,
      { status: 404, title: 'Nenhum registro encontrado', body: '{\n  "error": "Usuário não encontrado."\n}' },
      internalError('Erro ao remover usuário'),
    ],
  },
];
