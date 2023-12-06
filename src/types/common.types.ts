export type Nullable<T> = NonNullable<T> | null;
export type Maybe<T> = NonNullable<T> | undefined;
export type Getter<T> = (...args: any) => T | Promise<T>;
export type Setter<T> = (value: T) => void | Promise<void>;
export type Action = (...args: any[]) => void | Promise<void>;