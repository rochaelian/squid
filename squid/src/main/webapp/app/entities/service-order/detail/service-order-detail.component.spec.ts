import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { ServiceOrderDetailComponent } from './service-order-detail.component';

describe('Component Tests', () => {
  describe('ServiceOrder Management Detail Component', () => {
    let comp: ServiceOrderDetailComponent;
    let fixture: ComponentFixture<ServiceOrderDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [ServiceOrderDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ serviceOrder: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(ServiceOrderDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(ServiceOrderDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load serviceOrder on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.serviceOrder).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
