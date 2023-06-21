import { Component, OnInit } from '@angular/core';
import { faCar } from '@fortawesome/free-solid-svg-icons';
import { LoginService } from '../../login/login.service';
import { AccountService } from '../../core/auth/account.service';
import { ProfileService } from '../profiles/profile.service';
import { Router } from '@angular/router';
import { Account } from '../../core/auth/account.model';

export interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  authorities: string | string[];
}

export const ROUTES: RouteInfo[] = [
  // Not a valid menu option for 1st iteration
  { path: '/dashboard', title: 'Dashboard', icon: 'nc-chart-bar-32', class: '', authorities: 'ROLE_ADMIN' },
  {
    path: '/user-profile',
    title: 'Perfil de Usuario',
    icon: 'nc-single-02',
    class: '',
    authorities: ['ROLE_ADMIN', 'ROLE_USER', 'ROLE_OPERATOR', 'ROLE_BUSINESS_ADMIN'],
  },
  { path: '/app', title: 'Valores del sistema', icon: 'nc-money-coins', class: '', authorities: 'ROLE_ADMIN' },
  { path: '/admin/user-management', title: 'Lista de usuarios', icon: 'nc-circle-10', class: '', authorities: 'ROLE_ADMIN' },
  { path: '/vehicle', title: 'Vehículos registrados', icon: 'nc-ambulance', class: '', authorities: ['ROLE_USER', 'ROLE_ADMIN'] },
  { path: '/catalog', title: 'Catálogos del sistema', icon: 'nc-tile-56', class: '', authorities: 'ROLE_ADMIN' },
  {
    path: '/cat-service',
    title: 'Servicios del sistema',
    icon: 'nc-settings',
    class: '',
    authorities: ['ROLE_ADMIN'],
  },
  { path: '/operator-management', title: 'Mis operadores', icon: 'nc-single-02', class: '', authorities: 'ROLE_BUSINESS_ADMIN' },
  { path: '/business', title: 'Comercios', icon: 'nc-briefcase-24', class: '', authorities: ['ROLE_BUSINESS_ADMIN', 'ROLE_ADMIN'] },
  { path: '/businesses', title: 'Buscar comercios', icon: 'nc-briefcase-24', class: '', authorities: 'ROLE_USER' },
  {
    path: '/order',
    title: 'Historial de órdenes',
    icon: 'nc-paper',
    class: '',
    authorities: ['ROLE_USER', 'ROLE_ADMIN', 'ROLE_BUSINESS_ADMIN'],
  },
  { path: '/appointment', title: 'Citas', icon: 'nc-briefcase-24', class: '', authorities: 'ROLE_OPERATOR' },
  { path: '/order', title: 'Órdenes', icon: 'nc-paper', class: '', authorities: 'ROLE_OPERATOR' },
  { path: '/business-service', title: 'Mis servicios', icon: 'nc-settings', class: '', authorities: 'ROLE_BUSINESS_ADMIN' },
  { path: '/schedule', title: 'Días feriados', icon: 'nc-calendar-60', class: '', authorities: 'ROLE_BUSINESS_ADMIN' },
  { path: '/insurance', title: 'Trámites aseguradora', icon: 'nc-support-17', class: '', authorities: ['ROLE_OPERATOR', 'ROLE_USER'] },
  { path: '/dashboard-owner', title: 'Mis ganancias', icon: 'nc-money-coins', class: '', authorities: 'ROLE_BUSINESS_ADMIN' },
  { path: '/seo-record', title: 'Bitácora de pagos SEO', icon: 'nc-bullet-list-67', class: '', authorities: 'ROLE_ADMIN' },
];

@Component({
  selector: 'jhi-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
  menuItems!: RouteInfo[];
  faCar = faCar;
  account: Account | null = null;

  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.accountService.getAuthenticationState().subscribe(account => (this.account = account));
    this.menuItems = [...ROUTES];
  }
}
