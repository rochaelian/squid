import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { BusinessDetailComponent } from './business-detail.component';
import { BusinessService } from '../service/business.service';
import { BusinessServiceService } from '../../business-service/service/business-service.service';

describe('Component Tests', () => {
  describe('Business Management Detail Component', () => {
    let comp: BusinessDetailComponent;
    let fixture: ComponentFixture<BusinessDetailComponent>;
    let service: BusinessService;
    let businessServiceService: BusinessServiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BusinessDetailComponent],
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { data: of({ business: { id: 123 } }) },
          },
        ],
      })
        .overrideTemplate(BusinessDetailComponent, '')
        .compileComponents();
      fixture = TestBed.createComponent(BusinessDetailComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(BusinessService);
      businessServiceService = TestBed.inject(BusinessServiceService);

      const headers = new HttpHeaders().append('link', 'link;link');
      jest.spyOn(service, 'query').mockReturnValue(of(new HttpResponse({ body: [{ id: 123 }], headers })));
      jest.spyOn(businessServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: [{ id: 123 }], headers })));
    });

    describe('OnInit', () => {
      it('Should load business on init', () => {
        // WHEN
        comp.ngOnInit();

        // THEN
        expect(service.query).toHaveBeenCalled();
        expect(comp.businessServices?.[0]).toEqual(expect.objectContaining({ id: 123 }));
      });
    });
  });
});
