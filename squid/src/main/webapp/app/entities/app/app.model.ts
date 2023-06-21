export interface IAPP {
  id?: number;
  type?: number | null;
  income?: number | null;
  comission?: number | null;
  sEOCost?: number | null;
}

export class APP implements IAPP {
  constructor(
    public id?: number,
    public type?: number | null,
    public income?: number | null,
    public comission?: number | null,
    public sEOCost?: number | null
  ) {}
}

export function getAPPIdentifier(aPP: IAPP): number | undefined {
  return aPP.id;
}
