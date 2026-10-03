import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common'
import { Response } from 'express'
import { QueryFailedError } from 'typeorm'

@Catch()
class HttpExceptionFilter implements ExceptionFilter {
  public catch(exception: Error, host: ArgumentsHost): void {
    const errorResponse: Typed.Api.Response.Error = {
      type: 'error',
      code: exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR,
      message: this.getMessage(exception),
      cause: this.getCause(exception),
      timestamp: new Date().toISOString(),
    }

    host
      .switchToHttp()
      .getResponse<Response>()
      .status(exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR)
      .json(errorResponse)
  }

  private getMessage(exception: Error): string {
    if (exception instanceof HttpException) {
      const { error } = exception.getResponse() as { error: string }
      return error
    }

    if (exception instanceof QueryFailedError) {
      return 'Database error'
    }

    return 'Internal server error'
  }

  private getCause(exception: Error): string[] {
    if (exception instanceof HttpException) {
      return this.getHttpExceptionCause(exception)
    }

    if (exception instanceof QueryFailedError) {
      return ['A database error occurred while processing the request.']
    }

    return [exception.message || 'An unexpected error occurred.']
  }

  private getHttpExceptionCause(exception: HttpException): string[] {
    const response = exception.getResponse()

    if (typeof response === 'object' && response !== null) {
      if ('cause' in response && Array.isArray(response.cause)) {
        return response.cause.filter((cause): cause is string => typeof cause === 'string')
      }

      if ('message' in response) {
        const message = response.message

        if (typeof message === 'string') {
          return [message]
        }

        if (Array.isArray(message)) {
          return message.filter((cause): cause is string => typeof cause === 'string')
        }
      }
    }

    return [exception.message]
  }
}

export { HttpExceptionFilter }
