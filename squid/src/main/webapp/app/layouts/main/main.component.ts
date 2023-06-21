import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';

import { AccountService } from 'app/core/auth/account.service';
import { Account } from '../../core/auth/account.model';
import PerfectScrollbar from 'perfect-scrollbar';

@Component({
  selector: 'jhi-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  account: Account | null = null;

  constructor(private accountService: AccountService, private titleService: Title, private router: Router) {}

  ngOnInit(): void {
    // try to log in automatically
    this.accountService.identity().subscribe();
    this.accountService.getAuthenticationState().subscribe(account => (this.account = account));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateTitle();
      }
    });
  }

  private getPageTitle(routeSnapshot: ActivatedRouteSnapshot): string {
    let title: string = routeSnapshot.data['pageTitle'] ?? '';
    if (routeSnapshot.firstChild) {
      title = this.getPageTitle(routeSnapshot.firstChild) || title;
    }
    return title;
  }

  private updateTitle(): void {
    let pageTitle = this.getPageTitle(this.router.routerState.snapshot.root);
    if (!pageTitle) {
      pageTitle = 'Squid';
    }
    this.titleService.setTitle(pageTitle);
  }
}
