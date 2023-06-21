import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { BusinessServiceDetailComponent } from './business-service-detail.component';

describe('Component Tests', () => {
  describe('BusinessService Management Detail Component', () => {
    let comp: BusinessServiceDetailComponent;
    let fixture: ComponentFixture<BusinessServiceDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [BusinessServiceDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ businessService: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BusinessServiceDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BusinessServiceDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load businessService on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.businessService).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
