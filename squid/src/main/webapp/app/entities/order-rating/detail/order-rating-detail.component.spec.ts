import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { OrderRatingDetailComponent } from './order-rating-detail.component';

describe('Component Tests', () => {
  describe('OrderRating Management Detail Component', () => {
    let comp: OrderRatingDetailComponent;
    let fixture: ComponentFixture<OrderRatingDetailComponent>;

    beforeEach(() => {
      TestBed.configureTestingModule({
        declarations: [OrderRatingDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ orderRating: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(OrderRatingDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(OrderRatingDetailComponent);
      comp = fixture.componentInstance;
    });

    describe('OnInit', () => {
      it('Should load orderRating on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(comp.orderRating).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
