import { NestMiddleware } from "@nestjs/common";

export class LoggerMiddleware implements NestMiddleware {
    use(req: any, res: any, next: (error?: any) => void) {

        console.log('Logger middleware')

        //  this is  a middleware for all

        next();
    }
}