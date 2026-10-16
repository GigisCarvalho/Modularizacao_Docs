/*
  COMPONENTE PRINCIPAL
  --------------------
  Um componente Angular tem 3 partes:
    - app.ts   -> a lógica (variáveis e funções)  <- você está aqui
    - app.html -> o que aparece na tela
    - app.css  -> o visual (cores, tamanhos)
*/
import { Component, computed, signal } from '@angular/core';
import { apiBaseUrl, endpoints, type ApiEndpoint } from './api-docs';

@Component({
  selector: 'app-root',        // nome da tag usada no index.html
  standalone: true,            // componente independente (não precisa de NgModule)
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  // Dados que vêm do arquivo api-docs.ts, expostos para o HTML.
  readonly endpoints = endpoints;
  readonly apiBaseUrl = apiBaseUrl;

  // Exemplo exibido na Home. Fica aqui porque o HTML não aceita chaves soltas.
  readonly validationExample = JSON.stringify({
    errors: [{ type: 'field', value: 'email-invalido', msg: 'Email inválido.', path: 'email', location: 'body' }],
  }, null, 2);

  /*
    SIGNALS: "caixinhas" que guardam um valor.
    Quando o valor muda com .set(), a tela se atualiza sozinha.
    Para ler o valor, chamamos como função: selectedId()
  */
  readonly selectedId = signal('home');   // página aberta ('home' ou id de um endpoint)
  readonly search = signal('');           // texto digitado na busca do menu
  readonly format = signal<'http' | 'curl'>('http'); // formato do exemplo
  readonly copied = signal('');           // qual botão "Copiar" foi clicado
  readonly menuOpen = signal(false);      // menu aberto no celular
  readonly groupOpen = signal(true);      // grupo "Usuários" do menu aberto ou fechado

  // Tema atual. Lemos o valor salvo no navegador (localStorage) para lembrar a escolha.
  readonly theme = signal<'light' | 'dark'>(
    localStorage.getItem('theme') === 'dark' ? 'dark' : 'light',
  );

  constructor() {
    // Aplica o tema salvo assim que a aplicação abre.
    this.applyTheme();
  }

  /*
    COMPUTED: valor calculado a partir de outros signals.
    Recalcula sozinho quando "search" ou "selectedId" mudam.
  */

  // Endpoints que aparecem no menu, filtrados pela busca.
  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    return this.endpoints.filter((e) =>
      `${e.title} ${e.method} ${e.path}`.toLowerCase().includes(term),
    );
  });

  // Endpoint selecionado (ou undefined quando estamos na Home).
  readonly selected = computed(() =>
    this.endpoints.find((e) => e.id === this.selectedId()),
  );

  // Alterna entre claro e escuro.
  toggleTheme(): void {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
    localStorage.setItem('theme', this.theme()); // salva a escolha
    this.applyTheme();
  }

  // Coloca data-theme="light" ou "dark" na tag <html>.
  // O styles.css troca as cores conforme esse atributo.
  private applyTheme(): void {
    document.documentElement.setAttribute('data-theme', this.theme());
  }

  // Abre uma página e fecha o menu do celular.
  select(id: string): void {
    this.selectedId.set(id);
    this.menuOpen.set(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // Troca o formato do exemplo pelo valor escolhido no <select>.
  setFormat(value: string): void {
    this.format.set(value === 'curl' ? 'curl' : 'http');
  }

  // Monta o texto do exemplo de requisição (HTTP ou cURL).
  example(endpoint: ApiEndpoint): string {
    const url = this.apiBaseUrl + endpoint.exampleUrl;

    if (this.format() === 'http') {
      const lines = [`${endpoint.method} ${url} HTTP/1.1`];
      if (endpoint.bodyExample) {
        lines.push('Content-Type: application/json', '', endpoint.bodyExample);
      }
      return lines.join('\n');
    }

    // Formato cURL (comando de terminal).
    const lines = [`curl -X ${endpoint.method} "${url}"`];
    if (endpoint.bodyExample) {
      lines.push(`  -H "Content-Type: application/json"`, `  -d '${endpoint.bodyExample}'`);
    }
    return lines.join(' \\\n');
  }

  // Copia um texto para a área de transferência e mostra "Copiado!" por 1,5 s.
  async copy(text: string, key: string): Promise<void> {
    await navigator.clipboard.writeText(text);
    this.copied.set(key);
    setTimeout(() => this.copied.set(''), 1500);
  }

  // Junta parâmetros de rota, query string e body em uma lista de seções,
  // assim o HTML usa um único bloco para mostrar as três listas.
  fieldSections(endpoint: ApiEndpoint) {
    return [
      { title: 'Parâmetros de rota', fields: endpoint.params ?? [] },
      { title: 'Query string', fields: endpoint.query ?? [] },
      { title: 'Body (JSON)', fields: endpoint.body ?? [] },
    ].filter((section) => section.fields.length > 0); // esconde seções vazias
  }

  // Erros do endpoint selecionado, ordenados pelo status (400, 404, 409, 500).
  sortedErrors(endpoint: ApiEndpoint) {
    return [...endpoint.errors].sort((a, b) => a.status - b.status);
  }
}
