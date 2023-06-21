import * as dayjs from 'dayjs';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { IOrder } from 'app/entities/order/order.model';
import { IBusinessService } from 'app/entities/business-service/business-service.model';
import { IFile } from 'app/entities/file/file.model';

export interface IServiceOrder {
  id?: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  deductible?: number | null;
  updatedCost?: number | null;
  comment?: string | null;
  status?: ICatalog | null;
  order?: IOrder | null;
  businessService?: IBusinessService | null;
  files?: IFile[] | null;
}

export interface IServiceOrderEditable extends IServiceOrder {
  commentEditable?: boolean | null;
  statusLoading?: boolean | null;
}

export class ServiceOrder implements IServiceOrder {
  constructor(
    public id?: number,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public deductible?: number | null,
    public updatedCost?: number | null,
    public comment?: string | null,
    public status?: ICatalog | null,
    public order?: IOrder | null,
    public businessService?: IBusinessService | null,
    public files?: IFile[] | null
  ) {}
}

export class ServiceOrderWrapper implements IServiceOrderEditable {
  constructor(
    public id?: number,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public deductible?: number | null,
    public updatedCost?: number | null,
    public comment?: string | null,
    public status?: ICatalog | null,
    public order?: IOrder | null,
    public businessService?: IBusinessService | null,
    public files?: IFile[] | null,
    public commentEditable?: false | null,
    public statusLoading?: false | null
  ) {}
}

export function getServiceOrderIdentifier(serviceOrder: IServiceOrder): number | undefined {
  return serviceOrder.id;
}

export interface booleanReturn {
  retData: boolean;
}
