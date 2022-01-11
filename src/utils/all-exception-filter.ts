import {
  ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus,
} from '@nestjs/common';
import * as JSONAPISerializer from 'json-api-serializer';

// tslint:disable-next-line:variable-name
// tslint:disable-next-line:variable-name
const Serializer = new JSONAPISerializer();

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    const request = ctx.getRequest();

    // const isAcceptedApi = request.url.includes('api/');

    // const user = isAcceptedApi ? request.user : 'ATTACK';
    const { url } = request;
    // const headers = request.headers;

    const status = exception instanceof HttpException || +exception.getStatus()
      ? +exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
    const stack = !exception.stack ? null : exception.stack;

    console.log('\x1b[36m', stack, '\x1b[0m');
    const errorCode = (exception as any)?.response?.error || undefined;

    const errorMessage: any = (exception as any)?.response?.message
    || exception?.message
    || exception;

    let errorDefault: any = {
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: url,
      code: errorCode,
      message: errorMessage,
    };

    if (typeof errorMessage === 'object' && errorMessage.length) {
      const error = errorMessage.map((message) => ({
        ...errorDefault,
        message,
      }));

      errorDefault = error;
    }

    // Log.create(
    //   {
    //     type: LOG_TYPE_ERR,
    //     code: errorCode || '00',
    //     title: 'ERROR',
    //     clinicId: user?.clinic?.id || 0,
    //     detail:
    //       (typeof errorMessage == 'object' && JSON.stringify(errorMessage)) ||
    //       errorMessage,
    //     request: request.body,
    //     user,
    //     url,
    //     reference: stack,
    //     statusCode: status,
    //     date: dateNow().toDate().toString(),
    //     headers,
    //   },
    //   { logging: false },
    // );

    response.status(status).json(Serializer.serializeError(errorDefault));
  }
}
