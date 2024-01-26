import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Observable, map } from 'rxjs';

interface ClassConstructor {
  new (...args: any[]): {};
}

interface SerializeCallback {
  (data: any): any;
}

export function Serialize(dto: ClassConstructor, callback?: SerializeCallback) {
  return UseInterceptors(new SerializeInterceptor(dto, callback));
}

export class SerializeInterceptor implements NestInterceptor {
  constructor(
    private readonly dto: any,
    private readonly callback?: SerializeCallback,
  ) {}

  intercept(
    context: ExecutionContext,
    handler: CallHandler<any>,
  ): Observable<any> {
    // Run sth before a req is handled by the request handler
    return handler.handle().pipe(
      map((data: any) => {
        // Run sth before the res is sent out
        return {
          message: data.message,
          result: {
            // data.result.user => get `user` as key
            // data.result.users => get `users` as key
            [Object.keys(data.result)[0]]: plainToInstance(
              this.dto,
              this.callback(data),
              {
                excludeExtraneousValues: true,
              },
            ),
          },
        };
      }),
    );
  }
}
