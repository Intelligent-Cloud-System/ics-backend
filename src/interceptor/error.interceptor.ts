import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApplicationError } from 'src/shared/error/applicationError';

@Injectable()
export class ErrorInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof ApplicationError) {
          return throwError(
            () =>
              new HttpException(
                {
                  id: err.id,
                  message: err.message,
                  statusCode: err.statusCode,
                  data: err.data,
                },
                err.statusCode
              )
          );
        }

        return throwError(() => err);
      })
    );
  }
}
