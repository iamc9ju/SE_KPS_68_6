import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  meta?: any;
}

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    return next.handle().pipe(
      map((data: any) => {

        // ✅ ถ้าเป็น array ให้ return ตรง ๆ เลย
        if (Array.isArray(data)) {
          return {
            success: true,
            data,
          };
        }

        // ✅ ถ้าเป็น primitive (string, number, null)
        if (
          data === null ||
          typeof data !== 'object'
        ) {
          return {
            success: true,
            data,
          };
        }

        const { message, meta, ...rest } = data;

        const responseData = rest.data ?? rest;

        return {
          success: true,
          data: responseData,
          ...(meta ? { meta } : {}),
          ...(message ? { message } : {}),
        };
      }),
    );
  }
}