import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { TransactionService } from '../service/transaction.service';

import { TransactionComponent } from './transaction.component';

describe('Component Tests', () => {
  describe('Transaction Management Component', () => {
    let comp: TransactionComponent;
    let fixture: ComponentFixture<TransactionComponent>;
    let service: TransactionService;

    beforeEach(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule],
        declarations: [TransactionComponent],
      })
        .overrideTemplate(TransactionComponent, '')
        .compileComponents();

      fixture = TestBed.createComponent(TransactionComponent);
      comp = fixture.componentInstance;
      service = TestBed.inject(TransactionService);

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
      expect(comp.transactions?.[0]).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
