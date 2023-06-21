import { Component, OnInit } from '@angular/core';
import { EventSettingsModel, View, EventRenderedArgs } from '@syncfusion/ej2-angular-schedule';
import { IOrder, IOrderCalendar, OrderCalendar } from '../order.model';
import { OrderService } from '../service/order.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { IBusiness } from '../../business/business.model';
import { CatalogService } from '../../catalog/service/catalog.service';
import { ICatalog } from '../../catalog/catalog.model';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { IServiceOrder, IServiceOrderEditable } from '../../service-order/service-order.model';
import { ServiceOrderService } from '../../service-order/service/service-order.service';
import { DATE_TIME_FORMAT } from '../../../config/input.constants';
import * as dayjs from 'dayjs';
import Swal from 'sweetalert2';
import * as moment from 'moment';

@Component({
  selector: 'jhi-calendar',
  //template: '<ejs-schedule width="100%" height="550px" [eventSettings]="eventObject" [selectedDate]="setDate" [currentView]="setView" > </ejs-schedule>',
  templateUrl: './calendar.component.html',
})
export class CalendarComponent implements OnInit {
  orders?: IOrder[] = [];
  order: IOrder | null = null;
  ordersCalendar: OrderCalendar[] = [];
  orderCalendar: IOrderCalendar | null = null;
  catalog?: ICatalog | null;
  serviceOrders: IServiceOrderEditable[] = [];
  isLoading = false;
  dataLoad = false;
  isSaving = false;
  timeService = 0;
  startDateCal = new Date();
  endDateCal = new Date();
  yesterday = new Date(new Date().setDate(new Date().getDate() - 1));
  today = new Date(this.startDateCal.getFullYear(), this.startDateCal.getMonth(), this.startDateCal.getDate(), 8, 0, 0);
  ordersTesting = [];

  public workWeekDays = [1, 2, 3, 4, 5, 6];
  public showWeekend = false;
  public setView: View = 'Week';
  public setDate: Date = new Date(2021, 7, 15);
  public startHour = '08:00';
  public endHour = '18:00';
  public eventObject: EventSettingsModel = {
    dataSource: [],
  };

  constructor(
    protected orderService: OrderService,
    protected activatedRoute: ActivatedRoute,
    protected catalogService: CatalogService,
    private router: Router,
    protected serviceOrderService: ServiceOrderService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ order }) => {
      this.order = order;
      //console.warn("current order", order);
      if (this.order?.id !== undefined) {
        this.serviceOrderService.findByOrder(this.order.id).subscribe((res: HttpResponse<IServiceOrder[]>) => {
          this.serviceOrders = res.body ?? [];
          for (const point of this.serviceOrders) {
            this.timeService = this.timeService + point.businessService!.duration!;
            //console.warn(this.timeService);
          }
          this.printOrders(this.order, this.addHoursToStartDate());
        });
      }
    });
    Swal.fire({
      title: 'Cargando calendario',
      html: 'Por favor espere...',
      iconHtml: '<i class="fas fa-car-alt"></i>',
      timer: 1500,
      showConfirmButton: false,
      timerProgressBar: true,
    });
    //this.eventObject.dataSource = this.ordersTest;
    //this.eventObject.dataSource = this.ordersCalendar;
  }

  printOrders(order: any, endDatep: any): void {
    this.orderService.queryCalendar(order.id).subscribe((res: HttpResponse<IOrder[]>) => {
      if (res.body) {
        this.orders = res.body;
        console.warn('ordenes', this.orders);
        for (const point of this.orders) {
          this.ordersCalendar.push({
            Id: point.id,
            Subject: 'Orden registrada',
            StartTime: point.startDate?.format('YYYY-MM-DDTHH:mm:ssZ'),
            EndTime: point.endDate?.format('YYYY-MM-DDTHH:mm:ssZ'),
            IsAllDay: false,
            IsBlock: false,
            IsReadonly: true,
            Color: '#ea7a57',
          });
        }
        this.ordersCalendar.push({
          Id: 1010101010,
          Subject: '',
          StartTime: '1980-08-19T00:00:00Z',
          EndTime: this.yesterday.toString(),
          IsAllDay: true,
          IsBlock: true,
          IsReadonly: true,
        });
        this.ordersCalendar.push({
          //Id: this.order!.id,
          Subject: 'Nueva cita',
          StartTime: this.today.toString(),
          EndTime: this.endDateCal.toString(),
          IsAllDay: false,
          IsBlock: false,
          IsReadonly: false,
        });
        this.ordersCalendar.push({
          Id: 1,
          Subject: 'Feriado',
          StartTime: '2021-09-15T08:00:00Z',
          EndTime: '2021-09-15T22:00:00Z',
          IsAllDay: true,
          IsBlock: true,
          IsReadonly: false,
        });
      }
      this.eventObject.dataSource = this.ordersCalendar;
      this.dataLoad = true;
    });
  }

  saveNewOrder(): void {
    const orders = <Array<any>>this.eventObject.dataSource;
    orders.map(order => {
      if (order.Subject === 'Nueva cita') {
        const newDate = new Date(order.StartTime);
        const formattedDate = moment(newDate).format('YYYY-MM-DDTHH:mm:ss');
        const newEndDate = new Date(order.EndTime);
        const formattedEndDate = moment(newEndDate).format('YYYY-MM-DDTHH:mm:ss');
        this.save(formattedDate, formattedEndDate);
      }
    });
  }

  addHoursToStartDate(): any {
    //console.warn("time service", this.timeService);
    const endDatep = this.endDateCal.setHours(8 + this.timeService);
    //console.warn("fecha final", this.endDateCal);
    return endDatep;
  }

  save(startDate: any, endDate: any): void {
    this.isSaving = true;
    //this.order!.status = this.catalog;
    this.order!.startDate = dayjs(startDate, DATE_TIME_FORMAT);
    this.order!.endDate = dayjs(endDate, DATE_TIME_FORMAT);
    if (this.order!.id !== undefined) {
      this.subscribeToSaveResponse(this.orderService.update(this.order!));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IOrder>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe(
      () => this.onSaveSuccess(),
      () => this.onSaveError()
    );
  }

  protected onSaveSuccess(): void {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'La cita fue agendada con éxito.',
      showConfirmButton: true,
      timerProgressBar: true,
    }).then(() => {
      this.router.navigateByUrl('businesses');
    });
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }
}
