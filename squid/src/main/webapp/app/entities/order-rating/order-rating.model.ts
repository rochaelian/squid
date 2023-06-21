import { IOrder } from 'app/entities/order/order.model';

export interface IOrderRating {
  id?: number;
  rating?: number | null;
  comment?: string | null;
  order?: IOrder | null;
}

export class OrderRating implements IOrderRating {
  constructor(public id?: number, public rating?: number | null, public comment?: string | null, public order?: IOrder | null) {}
}

export function getOrderRatingIdentifier(orderRating: IOrderRating): number | undefined {
  return orderRating.id;
}
