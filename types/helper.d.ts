export type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

export type Merge<T, U> = Prettify<T & U>;

interface SuccessfulAction<T> {
  data: T;
  error: null;
}

interface UnsuccessfulAction {
  data: null;
  error: string;
}

export type ActionResult<T> = SuccessfulAction<T> | UnsuccessfulAction;
