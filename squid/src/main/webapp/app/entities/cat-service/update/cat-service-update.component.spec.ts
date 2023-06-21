jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { CatServiceService } from '../service/cat-service.service';
import { ICatService, CatService } from '../cat-service.model';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

import { CatServiceUpdateComponent } from './cat-service-update.component';

describe('Component Tests', () => {
  describe('CatService Management Update Component', () => {
    let comp: CatServiceUpdateComponent;
    let fixture: ComponentFixture<CatServiceUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let catServiceService: CatServiceService;
    let businessService: BusinessService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [CatServiceUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(CatServiceUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(CatServiceUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      catServiceService = TestBed.inject(CatServiceService);
      businessService = TestBed.inject(BusinessService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Business query and add missing value', () => {
        const catService: ICatService = { id: 456 };
        const business: IBusiness = { id: 71843 };
        catService.business = business;

        const businessCollection: IBusiness[] = [{ id: 59997 }];
        jest.spyOn(businessService, 'query').mockReturnValue(of(new HttpResponse({ body: businessCollection })));
        const additionalBusinesses = [business];
        const expectedCollection: IBusiness[] = [...additionalBusinesses, ...businessCollection];
        jest.spyOn(businessService, 'addBusinessToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ catService });
        comp.ngOnInit();

        expect(businessService.query).toHaveBeenCalled();
        expect(businessService.addBusinessToCollectionIfMissing).toHaveBeenCalledWith(businessCollection, ...additionalBusinesses);
        expect(comp.businessesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const catService: ICatService = { id: 456 };
        const business: IBusiness = { id: 39451 };
        catService.business = business;

        activatedRoute.data = of({ catService });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(catService));
        expect(comp.businessesSharedCollection).toContain(business);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CatService>>();
        const catService = { id: 123 };
        jest.spyOn(catServiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ catService });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: catService }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(catServiceService.update).toHaveBeenCalledWith(catService);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CatService>>();
        const catService = new CatService();
        jest.spyOn(catServiceService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ catService });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: catService }));
        saveSubject.complete();

        // THEN
        expect(catServiceService.create).toHaveBeenCalledWith(catService);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<CatService>>();
        const catService = { id: 123 };
        jest.spyOn(catServiceService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ catService });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(catServiceService.update).toHaveBeenCalledWith(catService);
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
    });
  });
});
