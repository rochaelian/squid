export interface IOrderByBusiness {
  image?: string | null;
  name?: string | null;
  cantOrders?: number | null;
  revenue?: number;
  rating?: number | null;
}

export class OrderByBusiness implements IOrderByBusiness {
  constructor(
    public image?: string | null,
    public name?: string | null,
    public cantOrders?: number | null,
    public revenue?: number,
    public rating?: number | null
  ) {}
}
