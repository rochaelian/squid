export interface IRatingComment {
  image?: string | null;
  userName?: string | null;
  rating?: number | null;
  comment?: string | null;
}

export class RatingComment implements IRatingComment {
  constructor(
    public image?: string | null,
    public userName?: string | null,
    public rating?: number | null,
    public comment?: string | null
  ) {}
}
