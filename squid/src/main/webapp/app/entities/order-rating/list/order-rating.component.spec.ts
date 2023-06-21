import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { OrderRatingService } from '../service/order-rating.service';

import { OrderRatingComponent } from './order-rating.component';

describe('Component Tests', () => {
  describe('OrderRating Management Component', () => {
    let comp: OrderRatingComponent;
    let fixture: ComponentFixture<OrderRatingComponent>;
    let service: OrderRatingService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [OrderRatingComponent],
      })
        .overrideTemplate(OrderRatingComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(OrderRatingComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(OrderRatingService);

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
      expect(comp.orderRatings?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
