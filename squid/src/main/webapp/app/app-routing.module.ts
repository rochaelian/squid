import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { errorRoute } from './layouts/error/error.route';
import { navbarRoute } from './layouts/navbar/navbar.route';
import { sidebarRoutes } from './layouts/sidebar/sidebar.route';
import { DEBUG_INFO_ENABLED } from 'app/app.constants';
import { Authority } from 'app/config/authority.constants';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';

const LAYOUT_ROUTES = [navbarRoute, ...sidebarRoutes, ...errorRoute];

@NgModule({
  imports: [
    RouterModule.forRoot(
      [
        {
          path: 'admin',
          data: {
            authorities: [Authority.ADMIN],
          },
          canActivate: [UserRouteAccessService],
          loadChildren: () => import('./admin/admin-routing.module').then(m => m.AdminRoutingModule),
        },
        {
          path: 'account',
          loadChildren: () => import('./account/account.module').then(m => m.AccountModule),
        },
        {
          path: 'login',
          loadChildren: () => import('./login/login.module').then(m => m.LoginModule),
        },
        {
          path: 'orders',
          loadChildren: () => import('./pages/all/order/order-page/order-page.module').then(m => m.OrderPageModule),
        },
        {
          path: 'insurances',
          loadChildren: () => import('./pages/insurance/insurance.component').then(m => m.InsuranceComponent),
        },
        {
          path: 'insuranceup',
          loadChildren: () => import('./pages/insurance-update/insurance-update.component').then(m => m.InsuranceUpdateComponent),
        },
        {
          path: 'dashboard-owner',
          loadChildren: () => import('./pages/dashboard-owner/dashboard-owner.module').then(m => m.DashboardOwnerModule),
        },

        {
          path: 'dashboard-owner',
          loadChildren: () => import('./pages/dashboard-owner/dashboard-owner.module').then(m => m.DashboardOwnerModule),
        },

        ...LAYOUT_ROUTES,
      ],
      { enableTracing: DEBUG_INFO_ENABLED }
    ),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
