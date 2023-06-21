export class Profile {
  constructor(
    public id: string,
    public login: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public imageUrl: string
  ) {}
}

export type File = {
  imageUrl: string;
};
