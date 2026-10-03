import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common'
import { Response } from 'express'
import { Observable, map } from 'rxjs'

@Injectable()
class ResponseInterceptor<T> implements NestInterceptor<T, Typed.Api.Response.Success<T> | void> {
  public intercept(context: ExecutionContext, next: CallHandler<T>): Observable<Typed.Api.Response.Success<T> | void> {
    const response = context.switchToHttp().getResponse<Response>()

    return next.handle().pipe(
      map((data): Typed.Api.Response.Success<T> | void => {
        if (response.statusCode === 204) return
        return {
          type: 'success',
          code: response.statusCode,
          message: 'Request successful',
          data,
        }
      })
    )
  }
}
export { ResponseInterceptor }
