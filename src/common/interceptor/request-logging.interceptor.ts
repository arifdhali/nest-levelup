import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common";
import { finalize, Observable } from "rxjs";


@Injectable()
export class RequestLoggerInterceptor implements NestInterceptor {
    private readonly logger = new Logger(RequestLoggerInterceptor.name)
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<unknown> {

        const req = context.switchToHttp().getRequest();


        const startedAt = Date.now();


        return next.handle().pipe(

            finalize(() => {
                let duration = Date.now() - startedAt;
                this.logger.log(
                    `method=${req.method} path=${req.path} ` +
                    `duration=${duration}ms requestId=${req.requestId ?? 'unknown'}`,
                );
            })
        );


    }
}