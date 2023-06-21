import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { VehicleService } from '../service/vehicle.service';

import { VehicleComponent } from './vehicle.component';

describe('Component Tests', () => {
  describe('Vehicle Management Component', () => {
    let comp: VehicleComponent;
    let fixture: ComponentFixture<VehicleComponent>;
    let service: VehicleService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [VehicleComponent],
      })
        .overrideTemplate(VehicleComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(VehicleComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(VehicleService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(
        of(
          new HttpResponse({
            body: [{ id: 123 }],
            headers,
          })
        )
      );
    });

    it('Should call load all on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(service.query).toHaveBeenCalled();
      expect(comp.vehicles?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
