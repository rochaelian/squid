import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IBusinessService } from '../business-service.model';

@Component({
  selector: 'jhi-business-service-detail',
  templateUrl: './business-service-detail.component.html',
})
export class BusinessServiceDetailComponent implements OnInit {
  businessService: IBusinessService | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ businessService }) => {
      this.businessService = businessService;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
