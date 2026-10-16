import { ArgumentsHost, Catch, ExceptionFilter, HttpException } from "@nestjs/common";


@Catch(HttpException)
export class HTTPExceptionFilter implements ExceptionFilter {

    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        let response = ctx.getResponse();
        let request = ctx.getRequest();
        let status = exception.getStatus();

        console.log(exception)


        response.status(status).json({
            success: false,
            statusCode: status,
            message: exception.message,
            path: request.url,
            timeStamp: new Date().toISOString()

        })
    }




}