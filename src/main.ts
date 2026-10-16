// Ponto de entrada da aplicação: o Angular começa por aqui.
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';

// "Liga" o componente principal (App) dentro da tag <app-root> do index.html.
bootstrapApplication(App).catch((erro) => console.error(erro));
