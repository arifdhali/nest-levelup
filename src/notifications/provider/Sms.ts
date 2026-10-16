import { Injectable } from "@nestjs/common";

export interface SmsResult {
    messageId: string;
    accepted: boolean;
}

@Injectable()
export class SmsProvider {

    async send(recipient: number[], subject: string, message: string): Promise<SmsResult> {

        console.log('----- SMS SENT (SIMULATED) -----');
        console.log(`To: ${recipient}`);
        console.log(`Subject: ${subject}`);
        console.log(`Message: ${message}`);

        return {
            messageId: `sms-${Date.now()}`,
            accepted: true
        }

    }

}