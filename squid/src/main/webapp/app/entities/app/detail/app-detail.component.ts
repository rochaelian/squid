import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAPP } from '../app.model';

@Component({
  selector: 'jhi-app-detail',
  templateUrl: './app-detail.component.html',
})
export class APPDetailComponent implements OnInit {
  aPP: IAPP | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ aPP }) => {
      this.aPP = aPP;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
