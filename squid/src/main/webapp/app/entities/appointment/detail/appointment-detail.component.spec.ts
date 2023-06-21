import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AppointmentDetailComponent } from './appointment-detail.component';

describe('Component Tests', () => {
  describe('Order Management Detail Component', () => {
    let comp: AppointmentDetailComponent;
    let fixture: ComponentFixture<AppointmentDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [AppointmentDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ order: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(AppointmentDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(AppointmentDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load order on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.order).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
