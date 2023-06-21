jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { BusinessService } from '../service/business.service';
import { IBusiness, Business } from '../business.model';
import { ILocation } from 'app/entities/location/location.model';
import { LocationService } from 'app/entities/location/service/location.service';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { CatalogService } from 'app/entities/catalog/service/catalog.service';

import { BusinessUpdateComponent } from './business-update.component';

describe('Component Tests', () => {
  describe('Business Management Update Component', () => {
    let comp: BusinessUpdateComponent;
    let fixture: ComponentFixture<BusinessUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let businessService: BusinessService;
    let locationService: LocationService;
    let userService: UserService;
    let catalogService: CatalogService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [BusinessUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(BusinessUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(BusinessUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      businessService = TestBed.inject(BusinessService);
      locationService = TestBed.inject(LocationService);
      userService = TestBed.inject(UserService);
      catalogService = TestBed.inject(CatalogService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call location query and add missing value', () => {
        const business: IBusiness = { id: 456 };
        const location: ILocation = { id: 50820 };
        business.location = location;

        const locationCollection: ILocation[] = [{ id: 38920 }];
        jest.spyOn(locationService, 'query').mockReturnValue(of(new HttpResponse({ body: locationCollection })));
        const expectedCollection: ILocation[] = [location, ...locationCollection];
        jest.spyOn(locationService, 'addLocationToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ business });
        comp.ngOnInit();

        expect(locationService.query).toHaveBeenCalled();
        expect(locationService.addLocationToCollectionIfMissing).toHaveBeenCalledWith(locationCollection, location);
        expect(comp.locationsCollection).toEqual(expectedCollection);
      });

      it('Should call User query and add missing value', () => {
        const business: IBusiness = { id: 456 };
        const owner: IUser = { id: 26533 };
        business.owner = owner;

        const userCollection: IUser[] = [{ id: 9712 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [owner];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ business });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call Catalog query and add missing value', () => {
        const business: IBusiness = { id: 456 };
        const catalogs: ICatalog[] = [{ id: 73172 }];
        business.catalogs = catalogs;

        const catalogCollection: ICatalog[] = [{ id: 61972 }];
        jest.spyOn(catalogService, 'query').mockReturnValue(of(new HttpResponse({ body: catalogCollection })));
        const additionalCatalogs = [...catalogs];
        const expectedCollection: ICatalog[] = [...additionalCatalogs, ...catalogCollection];
        jest.spyOn(catalogService, 'addCatalogToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ business });
        comp.ngOnInit();

        expect(catalogService.query).toHaveBeenCalled();
        expect(catalogService.addCatalogToCollectionIfMissing).toHaveBeenCalledWith(catalogCollection, ...additionalCatalogs);
        expect(comp.catalogsSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const business: IBusiness = { id: 456 };
        const location: ILocation = { id: 45895 };
        business.location = location;
        const owner: IUser = { id: 88985 };
        business.owner = owner;
        const catalogs: ICatalog = { id: 55789 };
        business.catalogs = [catalogs];

        activatedRoute.data = of({ business });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(business));
        expect(comp.locationsCollection).toContain(location);
        expect(comp.usersSharedCollection).toContain(owner);
        expect(comp.catalogsSharedCollection).toContain(catalogs);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Business>>();
        const business = { id: 123 };
        jest.spyOn(businessService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ business });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: business }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(businessService.update).toHaveBeenCalledWith(business);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Business>>();
        const business = new Business();
        jest.spyOn(businessService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ business });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: business }));
        saveSubject.complete();

        // THEN
        expect(businessService.create).toHaveBeenCalledWith(business);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<Business>>();
        const business = { id: 123 };
        jest.spyOn(businessService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ business });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(businessService.update).toHaveBeenCalledWith(business);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackLocationById', () => {
        it('Should return tracked Location primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackLocationById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackCatalogById', () => {
        it('Should return tracked Catalog primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackCatalogById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });
    });

    describe('Getting selected relationships', () => {
      describe('getSelectedCatalog', () => {
        it('Should return option if no Catalog is selected', () => {
          const option = { id: 123 };
          const result = comp.getSelectedCatalog(option);
          expect(result === option).toEqual(true);
        });

        it('Should return selected Catalog for according option', () => {
          const option = { id: 123 };
          const selected = { id: 123 };
          const selected2 = { id: 456 };
          const result = comp.getSelectedCatalog(option, [selected2, selected]);
          expect(result === selected).toEqual(true);
          expect(result === selected2).toEqual(false);
          expect(result === option).toEqual(false);
        });

        it('Should return option if this Catalog is not selected', () => {
          const option = { id: 123 };
          const selected = { id: 456 };
          const result = comp.getSelectedCatalog(option, [selected]);
          expect(result === option).toEqual(true);
          expect(result === selected).toEqual(false);
        });
      });
    });
  });
});
