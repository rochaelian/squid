import * as dayjs from 'dayjs';
import { IVehicle } from 'app/entities/vehicle/vehicle.model';
import { IUser } from 'app/entities/user/user.model';
import { ICatalog } from 'app/entities/catalog/catalog.model';
import { IOrderRating } from 'app/entities/order-rating/order-rating.model';
import { ITransaction } from 'app/entities/transaction/transaction.model';
import { IFile } from 'app/entities/file/file.model';

export interface IOrder {
  id?: number;
  startDate?: dayjs.Dayjs | null;
  endDate?: dayjs.Dayjs | null;
  totalCost?: number | null;
  comission?: number | null;
  vehicle?: IVehicle | null;
  operator?: IUser | null;
  status?: ICatalog | null;
  orderRating?: IOrderRating | null;
  transactions?: ITransaction[] | null;
  files?: IFile[] | null;
}

export class Order implements IOrder {
  constructor(
    public id?: number,
    public startDate?: dayjs.Dayjs | null,
    public endDate?: dayjs.Dayjs | null,
    public totalCost?: number | null,
    public comission?: number | null,
    public vehicle?: IVehicle | null,
    public operator?: IUser | null,
    public status?: ICatalog | null,
    public orderRating?: IOrderRating | null,
    public transactions?: ITransaction[] | null,
    public files?: IFile[] | null
  ) {}
}

export function getOrderIdentifier(order: IOrder): number | undefined {
  return order.id;
}
