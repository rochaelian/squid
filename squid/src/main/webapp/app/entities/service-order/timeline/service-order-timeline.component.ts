import { Component, ElementRef, Input, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { IServiceOrder, IServiceOrderEditable, ServiceOrder } from '../service-order.model';
import { ServiceOrderService } from '../service/service-order.service';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { CatalogService } from 'app/entities/catalog/service/catalog.service';
import { IOrder, Order } from 'app/entities/order/order.model';
import { OrderService } from 'app/entities/order/service/order.service';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { BusinessServiceService } from 'app/entities/business-service/service/business-service.service';
import * as dayjs from 'dayjs';
import { FileWrapper } from '../../file/file.model';
import { FileService } from '../../file/service/file.service';
import { DATE_TIME_FORMAT } from '../../../config/input.constants';

@Component({
  selector: 'jhi-service-order-timeline',
  templateUrl: './service-order-timeline.component.html',
})
export class ServiceOrderTimelineComponent implements OnInit {
  isSaving = false;

  @Input()
  catalogsSharedCollection: ICatalog[] = [];
  dropZoneFiles: File[] = [];
  isLoadingOrderStatus = false;
  isLoadingComment = false;

  @Input()
  so?: IServiceOrderEditable | undefined;

  copySo?: IServiceOrderEditable | undefined;

  @ViewChild('template', { static: true }) template: any;
  @ViewChild('addPhotoButton', { static: false }) photoBtn: ElementRef | undefined;

  @Input()
  odd?: boolean;

  constructor(
    protected viewContainerRef: ViewContainerRef,
    protected serviceOrderService: ServiceOrderService,
    protected catalogService: CatalogService,
    protected orderService: OrderService,
    protected businessServiceService: BusinessServiceService,
    protected fileService: FileService,
    protected activatedRoute: ActivatedRoute,
    protected fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.viewContainerRef.createEmbeddedView(this.template);
    this.copySo = JSON.parse(JSON.stringify(this.so!));
  }
  changeSOStatus(status: ICatalog): void {
    const so = this.so!;
    this.isLoadingOrderStatus = true;
    so.status = status;
    const now = dayjs();
    if (so.status.name === 'En proceso') {
      so.startDate = now;
    } else if (so.status.name === 'Terminado') {
      so.endDate = now;
    }
    this.serviceOrderService.update(so).subscribe((res: HttpResponse<IServiceOrder>) => {
      this.so!.status = res.body?.status ?? {};
      this.isLoadingOrderStatus = false;
    });
  }

  saveComment(): void {
    this.isLoadingComment = true;
    this.so!.commentEditable = false;
    this.serviceOrderService.update(this.so!).subscribe(res => {
      this.isLoadingComment = false;
    });
  }

  cancelComment(): void {
    this.so!.commentEditable = false;
    this.so!.comment = this.copySo!.comment;
  }

  transformImage(imageUrl: string): string {
    const height = '800';
    const faceTransformString = '/c_crop,g_face,h_400,w_400';
    const transformString = '/c_crop,h_' + height + ',w_' + height;
    const transformedImageUrl = imageUrl.slice(0, 54) + transformString + imageUrl.slice(54);
    return transformedImageUrl;
  }

  soDropboxOnSelect(event: { addedFiles: any }): void {
    this.dropZoneFiles.push(...event.addedFiles);
    const so = this.so!;
    const image = this.dropZoneFiles[0];

    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', 'squid_Proyecto3');
    data.append('cloud_name', 'squidproyecto3');

    this.fileService.uploadImageToCloudinary(data).subscribe(response => {
      const uRL = response.secure_url;
      const id = so.id;
      //New so it doesn't send all the so nested objects
      const serviceOrder = {
        ...new ServiceOrder(),
        id,
      };
      const file = {
        ...new FileWrapper(),
        uRL,
        serviceOrder,
      };

      this.fileService.create(file).subscribe(res => {
        //Update in list of photos
        if (so.files === null) {
          so.files = [file];
        } else {
          so.files?.push(file);
        }
        //To hide the dropzone
        this.photoBtn?.nativeElement.click();
        this.dropZoneFiles = [];
      });
    });
  }
}
