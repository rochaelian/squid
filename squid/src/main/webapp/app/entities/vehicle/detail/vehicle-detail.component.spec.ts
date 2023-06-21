import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { VehicleDetailComponent } from './vehicle-detail.component';

describe('Component Tests', () => {
  describe('Vehicle Management Detail Component', () => {
    let comp: VehicleDetailComponent;
    let fixture: ComponentFixture<VehicleDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [VehicleDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ vehicle: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(VehicleDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(VehicleDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load vehicle on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.vehicle).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
