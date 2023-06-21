jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BusinessServiceService } from '../service/business-service.service';
import { IBusinessService } from '../business-service.model';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';
import { ICatService } from 'app/entities/cat-service/cat-service.model';
import { CatServiceService } from 'app/entities/cat-service/service/cat-service.service';

import { BusinessServiceUpdateComponent } from './business-service-update.component';

describe('Component Tests', () => {
  describe('BusinessService Management Update Component', () => {
    let comp: BusinessServiceUpdateComponent;
    let fixture: ComponentFixture<BusinessServiceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let businessServiceService: BusinessServiceService;
    let businessService: BusinessService;
    let catServiceService: CatServiceService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BusinessServiceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BusinessServiceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BusinessServiceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      businessServiceService = TestBed.inject(BusinessServiceService);
      businessService = TestBed.inject(BusinessService);
      catServiceService = TestBed.inject(CatServiceService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Business query and add missing value', () => {
        const businessService: IBusinessService = { id: 456 };
        const business: IBusiness = { id: 82622 };
        businessService.business = business;

        const businessCollection: IBusiness[] = [{ id: 14380 }];
        jest.spyOn(businessService, 'query').mockReturnValue(of(new HttpResponse({ body: businessCollection })));
        const additionalBusinesses = [business];
        const expectedCollection: IBusiness[] = [...additionalBusinesses, ...businessCollection];
        jest.spyOn(businessService, 'addBusinessToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ businessService });
        comp.ngOnInit();

        expect(businessService.query).toHaveBeenCalled();
        expect(businessService.addBusinessToCollectionIfMissing).toHaveBeenCalledWith(businessCollection, ...additionalBusinesses);
        expect(comp.businessesSharedCollection).toEqual(expectedCollection);
      });

      it('Should call CatService query and add missing value', () => {
        const businessService: IBusinessService = { id: 456 };
        const service: ICatService = { id: 63326 };
        businessService.service = service;

        const catServiceCollection: ICatService[] = [{ id: 53267 }];
        jest.spyOn(catServiceService, 'query').mockReturnValue(of(new HttpResponse({ body: catServiceCollection })));
        const additionalCatServices = [service];
        const expectedCollection: ICatService[] = [...additionalCatServices, ...catServiceCollection];
        jest.spyOn(catServiceService, 'addCatServiceToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ businessService });
        comp.ngOnInit();

        expect(catServiceService.query).toHaveBeenCalled();
        expect(catServiceService.addCatServiceToCollectionIfMissing).toHaveBeenCalledWith(catServiceCollection, ...additionalCatServices);
        expect(comp.catServicesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const businessService: IBusinessService = { id: 456 };
        const business: IBusiness = { id: 21163 };
        businessService.business = business;
        const service: ICatService = { id: 5278 };
        businessService.service = service;

        activatedRoute.data = of({ businessService });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(businessService));
        expect(comp.businessesSharedCollection).toContain(business);
        expect(comp.catServicesSharedCollection).toContain(service);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BusinessService>>();
        const businessService = { id: 123 };
        jest.spyOn(businessServiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ businessService });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: businessService }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(businessServiceService.update).toHaveBeenCalledWith(businessService);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BusinessService>>();
        const businessService = new BusinessService();
        jest.spyOn(businessServiceService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ businessService });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: businessService }));
        saveSubject.complete();

        // THEN
        expect(businessServiceService.create).toHaveBeenCalledWith(businessService);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<BusinessService>>();
        const businessService = { id: 123 };
        jest.spyOn(businessServiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ businessService });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(businessServiceService.update).toHaveBeenCalledWith(businessService);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackBusinessById', () => {
        it('Should return tracked Business primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackBusinessById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCatServiceById', () => {
        it('Should return tracked CatService primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCatServiceById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });
  });
});
