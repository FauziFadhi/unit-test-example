export interface IUnfilledAtt {
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
export interface IUnfilledNotParanoidAtt {
  createdAt: Date;
  updatedAt: Date;
}

export type Optional<T> = {
  [P in keyof T]?: T[P] | null;
};
