import { NestMiddleware } from "@nestjs/common";
import { randomUUID } from "crypto";
import type { Request, Response, NextFunction } from 'express';

export class RequestMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {

        const uuid = randomUUID();

        (req as Request & { requestId: string }).requestId = uuid;

        res.setHeader('x-request-id', uuid);

        next();
    }
}