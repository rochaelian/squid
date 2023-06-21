import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { ServiceOrderService } from '../service/service-order.service';

import { ServiceOrderComponent } from './service-order.component';

describe('Component Tests', () => {
  describe('ServiceOrder Management Component', () => {
    let comp: ServiceOrderComponent;
    let fixture: ComponentFixture<ServiceOrderComponent>;
    let service: ServiceOrderService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [ServiceOrderComponent],
      })
        .overrideTemplate(ServiceOrderComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(ServiceOrderComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(ServiceOrderService);

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
      expect(comp.serviceOrders?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
