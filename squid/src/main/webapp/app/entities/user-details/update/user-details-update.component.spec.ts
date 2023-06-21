jest.mock('@angular/router');

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';

import { UserDetailsService } from '../service/user-details.service';
import { IUserDetails, UserDetails } from '../user-details.model';

import { IUser } from 'app/entities/user/user.model';
import { UserService } from 'app/entities/user/user.service';
import { IFile } from 'app/entities/file/file.model';
import { FileService } from 'app/entities/file/service/file.service';
import { IBusiness } from 'app/entities/business/business.model';
import { BusinessService } from 'app/entities/business/service/business.service';

import { UserDetailsUpdateComponent } from './user-details-update.component';

describe('Component Tests', () => {
  describe('UserDetails Management Update Component', () => {
    let comp: UserDetailsUpdateComponent;
    let fixture: ComponentFixture<UserDetailsUpdateComponent>;
    let activatedRoute: ActivatedRoute;
    let userDetailsService: UserDetailsService;
    let userService: UserService;
    let fileService: FileService;
    let businessService: BusinessService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [UserDetailsUpdateComponent],
        providers: [FormBuilder, ActivatedRoute],
      })
        .overrideTemplate(UserDetailsUpdateComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(UserDetailsUpdateComponent);
      activatedRoute = TestBed.inject(ActivatedRoute);
      userDetailsService = TestBed.inject(UserDetailsService);
      userService = TestBed.inject(UserService);
      fileService = TestBed.inject(FileService);
      businessService = TestBed.inject(BusinessService);

      comp = fixture.componentInstance;
    });

    describe('ngOnInit', () => {
      it('Should call User query and add missing value', () => {
        const userDetails: IUserDetails = { id: 456 };
        const internalUser: IUser = { id: 48561 };
        userDetails.internalUser = internalUser;

        const userCollection: IUser[] = [{ id: 28523 }];
        jest.spyOn(userService, 'query').mockReturnValue(of(new HttpResponse({ body: userCollection })));
        const additionalUsers = [internalUser];
        const expectedCollection: IUser[] = [...additionalUsers, ...userCollection];
        jest.spyOn(userService, 'addUserToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        expect(userService.query).toHaveBeenCalled();
        expect(userService.addUserToCollectionIfMissing).toHaveBeenCalledWith(userCollection, ...additionalUsers);
        expect(comp.usersSharedCollection).toEqual(expectedCollection);
      });

      it('Should call photograph query and add missing value', () => {
        const userDetails: IUserDetails = { id: 456 };
        const photograph: IFile = { id: 83118 };
        userDetails.photograph = photograph;

        const photographCollection: IFile[] = [{ id: 96670 }];
        jest.spyOn(fileService, 'query').mockReturnValue(of(new HttpResponse({ body: photographCollection })));
        const expectedCollection: IFile[] = [photograph, ...photographCollection];
        jest.spyOn(fileService, 'addFileToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        expect(fileService.query).toHaveBeenCalled();
        expect(fileService.addFileToCollectionIfMissing).toHaveBeenCalledWith(photographCollection, photograph);
        expect(comp.photographsCollection).toEqual(expectedCollection);
      });

      it('Should call Business query and add missing value', () => {
        const userDetails: IUserDetails = { id: 456 };
        const business: IBusiness = { id: 2299 };
        userDetails.business = business;

        const businessCollection: IBusiness[] = [{ id: 20868 }];
        jest.spyOn(businessService, 'query').mockReturnValue(of(new HttpResponse({ body: businessCollection })));
        const additionalBusinesses = [business];
        const expectedCollection: IBusiness[] = [...additionalBusinesses, ...businessCollection];
        jest.spyOn(businessService, 'addBusinessToCollectionIfMissing').mockReturnValue(expectedCollection);

        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        expect(businessService.query).toHaveBeenCalled();
        expect(businessService.addBusinessToCollectionIfMissing).toHaveBeenCalledWith(businessCollection, ...additionalBusinesses);
        expect(comp.businessesSharedCollection).toEqual(expectedCollection);
      });

      it('Should update editForm', () => {
        const userDetails: IUserDetails = { id: 456 };
        const internalUser: IUser = { id: 76901 };
        userDetails.internalUser = internalUser;
        const photograph: IFile = { id: 23151 };
        userDetails.photograph = photograph;
        const business: IBusiness = { id: 89092 };
        userDetails.business = business;

        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        expect(comp.editForm.value).toEqual(expect.objectContaining(userDetails));
        expect(comp.usersSharedCollection).toContain(internalUser);
        expect(comp.photographsCollection).toContain(photograph);
        expect(comp.businessesSharedCollection).toContain(business);
      });
    });

    describe('save', () => {
      it('Should call update service on save for existing entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserDetails>>();
        const userDetails = { id: 123 };
        jest.spyOn(userDetailsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userDetails }));
        saveSubject.complete();

        // THEN
        expect(comp.previousState).toHaveBeenCalled();
        expect(userDetailsService.update).toHaveBeenCalledWith(userDetails);
        expect(comp.isSaving).toEqual(false);
      });

      it('Should call create service on save for new entity', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserDetails>>();
        const userDetails = new UserDetails();
        jest.spyOn(userDetailsService, 'create').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.next(new HttpResponse({ body: userDetails }));
        saveSubject.complete();

        // THEN
        expect(userDetailsService.create).toHaveBeenCalledWith(userDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).toHaveBeenCalled();
      });

      it('Should set isSaving to false on error', () => {
        // GIVEN
        const saveSubject = new Subject<HttpResponse<UserDetails>>();
        const userDetails = { id: 123 };
        jest.spyOn(userDetailsService, 'update').mockReturnValue(saveSubject);
        jest.spyOn(comp, 'previousState');
        activatedRoute.data = of({ userDetails });
        comp.ngOnInit();

        // WHEN
        comp.save();
        expect(comp.isSaving).toEqual(true);
        saveSubject.error('This is an error!');

        // THEN
        expect(userDetailsService.update).toHaveBeenCalledWith(userDetails);
        expect(comp.isSaving).toEqual(false);
        expect(comp.previousState).not.toHaveBeenCalled();
      });
    });

    describe('Tracking relationships identifiers', () => {
      describe('trackUserById', () => {
        it('Should return tracked User primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackUserById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

      describe('trackFileById', () => {
        it('Should return tracked File primary key', () => {
          const entity = { id: 123 };
          const trackResult = comp.trackFileById(0, entity);
          expect(trackResult).toEqual(entity.id);
        });
      });

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
