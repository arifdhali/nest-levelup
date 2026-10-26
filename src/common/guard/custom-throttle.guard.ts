import { ExecutionContext } from "@nestjs/common";
import { ThrottlerGuard, ThrottlerLimitDetail } from "@nestjs/throttler";

export class CustomThrottleGuard extends ThrottlerGuard {
    protected async getErrorMessage(context: ExecutionContext, throttlerLimitDetail: ThrottlerLimitDetail): Promise<string> {
        return 'Too many requests. Please try again later.';
    }
}