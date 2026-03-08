export interface StandardErrorResponse {
  success: boolean;
  message: string | string[];
  errorCode: string;
  statusCode: number;
}
