export class Operator {
  constructor(
    public login: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public imageUrl: string,
    public password: string,
    public langKey: string,
    public authorities?: string[]
  ) {}
}

export interface Alert {
  type: string;
  message: string;
}
