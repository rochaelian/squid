import { Routes } from '@angular/router';

import { ErrorComponent } from './error.component';

export const errorRoute: Routes = [
  {
    path: 'error',
    component: ErrorComponent,
    data: {
      pageTitle: '¡Ha ocurrido un error!',
    },
  },
  {
    path: 'accessdenied',
    component: ErrorComponent,
    data: {
      pageTitle: '¡Ha ocurrido un error!',
      errorMessage: 'No tiene permisos para visitar ésta página.',
    },
  },
  {
    path: '404',
    component: ErrorComponent,
    data: {
      pageTitle: '¡Ha ocurrido un error!',
      errorMessage: 'Ésta página no existe.',
    },
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];
