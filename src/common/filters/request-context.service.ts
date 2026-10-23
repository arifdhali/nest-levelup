import { Inject, Injectable, Scope } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import type { Request } from "express";
import { randomUUID } from "crypto";


@Injectable({ scope: Scope.REQUEST })
export class RequestContextServices {
    private readonly requestId = randomUUID();

    constructor(@Inject(REQUEST) private readonly request: Request) { }


    getInformation() {
        // console.log(this.request)
        return {
            requestID: this.requestId,
            method: this.request.method,
            path: this.request.path
        }
    }

}