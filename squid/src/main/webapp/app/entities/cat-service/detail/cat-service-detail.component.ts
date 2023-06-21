import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ICatService } from '../cat-service.model';

@Component({
  selector: 'jhi-cat-service-detail',
  templateUrl: './cat-service-detail.component.html',
})
export class CatServiceDetailComponent implements OnInit {
  catService: ICatService | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ catService }) => {
      this.catService = catService;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
