type StringifiedType = Date;

export type Cached<T> = T extends Array<infer N>
  ? Array<Cached<N>>
  : {
      [P in keyof T]: T[P] extends StringifiedType
        ? T[P] | string
        : T[P] extends Record<string, unknown> | unknown[]
        ? Cached<T[P]>
        : T[P];
    };
