jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { SeoRecordService } from '../service/seo-record.service';
import { ISeoRecord, SeoRecord } from '../seo-record.model';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

import { SeoRecordUpdateComponent } from './seo-record-update.component';

describe('Component Tests', () => {
  describe('SeoRecord Management Update Component', () => {
    let comp: SeoRecordUpdateComponent;
    let fixture: ComponentFixture<SeoRecordUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let seoRecordService: SeoRecordService;
    let businessService: BusinessService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [SeoRecordUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(SeoRecordUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(SeoRecordUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      seoRecordService = TestBed.inject(SeoRecordService);
      businessService = TestBed.inject(BusinessService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call Business query and add missing value', () => {
        const seoRecord: ISeoRecord = { id: 456 };
        const business: IBusiness = { id: 66163 };
        seoRecord.business = business;

        const businessCollection: IBusiness[] = [{ id: 21236 }];
        jest.spyOn(businessService, 'query').mockReturnValue(of(new HttpResponse({ body: businessCollection })));
        const additionalBusinesses = [business];
        const expectedCollection: IBusiness[] = [...additionalBusinesses, ...businessCollection];
        jest.spyOn(businessService, 'addBusinessToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ seoRecord });
        comp.ngOnInit();

        expect(businessService.query).toHaveBeenCalled();
        expect(businessService.addBusinessToCollectionIfMissing).toHaveBeenCalledWith(businessCollection, ...additionalBusinesses);
        expect(comp.businessesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const seoRecord: ISeoRecord = { id: 456 };
        const business: IBusiness = { id: 38301 };
        seoRecord.business = business;

        activatedRoute.data = of({ seoRecord });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(seoRecord));
        expect(comp.businessesSharedCollection).toContain(business);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SeoRecord>>();
        const seoRecord = { id: 123 };
        jest.spyOn(seoRecordService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ seoRecord });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: seoRecord }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(seoRecordService.update).toHaveBeenCalledWith(seoRecord);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SeoRecord>>();
        const seoRecord = new SeoRecord();
        jest.spyOn(seoRecordService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ seoRecord });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: seoRecord }));
        saveSubject.complete();

        // THEN
        expect(seoRecordService.create).toHaveBeenCalledWith(seoRecord);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<SeoRecord>>();
        const seoRecord = { id: 123 };
        jest.spyOn(seoRecordService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ seoRecord });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(seoRecordService.update).toHaveBeenCalledWith(seoRecord);
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
