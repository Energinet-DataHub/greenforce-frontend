export type BaseResponse<T> = {
  result: T;
  success: boolean;
  errorCode: number;
  errorText: string;
  id: string;
}
