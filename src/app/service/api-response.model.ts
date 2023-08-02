
export interface VbomResponseModel<T> {
  code: string;
  data: {
    content: T
    [key:string]: any
  } | any | T;
  message?: string;
  status?:string;
}
