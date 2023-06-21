import { IUser } from 'app/entities/user/user.model';
import { IBusiness } from 'app/entities/business/business.model';
import { IOrder } from 'app/entities/order/order.model';

export interface ITransaction {
  id?: number;
  cardNumber?: string | null;
  cost?: number | null;
  source?: IUser | null;
  destination?: IBusiness | null;
  order?: IOrder | null;
}

export class Transaction implements ITransaction {
  constructor(
    public id?: number,
    public cardNumber?: string | null,
    public cost?: number | null,
    public source?: IUser | null,
    public destination?: IBusiness | null,
    public order?: IOrder | null
  ) {}
}

export function getTransactionIdentifier(transaction: ITransaction): number | undefined {
  return transaction.id;
}
