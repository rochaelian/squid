import { IOrder } from 'app/entities/order/order.model';
import { IServiceOrder } from 'app/entities/service-order/service-order.model';

export interface IFile {
  id?: number;
  uRL?: string | null;
  bLOBContentType?: string | null;
  bLOB?: string | null;
  order?: IOrder | null;
  serviceOrder?: IServiceOrder | null;
}

export class File implements IFile {
  constructor(
    public id?: number,
    public uRL?: string | null,
    public bLOBContentType?: string | null,
    public bLOB?: string | null,
    public order?: IOrder | null,
    public serviceOrder?: IServiceOrder | null
  ) {}
}

export class FileWrapper implements IFile {
  constructor(
    public id?: number,
    public uRL?: string | null,
    public bLOBContentType?: string | null,
    public bLOB?: string | null,
    public order?: IOrder | null,
    public serviceOrder?: IServiceOrder | null
  ) {}
}

export function getFileIdentifier(file: IFile): number | undefined {
  return file.id;
}
