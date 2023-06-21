import { Route } from '@angular/router';
import { OrderPageComponent } from './order-page.component';

export const ORDER_ROUTE: Route = {
  path: '',
  component: OrderPageComponent,
  data: {
    pageTitle: 'Orden',
  },
};
