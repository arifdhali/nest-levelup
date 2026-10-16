import { Injectable } from "@nestjs/common";

export interface EmailResult {
    messageId: string;
    accepted: boolean;
}

@Injectable()
export class EmailProvider {
    private attempt = 0;
    async send(recipient: string[], subject: string, message: string, senderName: string): Promise<EmailResult> {
        try {
            this.attempt++;
            console.log('Current attempt:', this.attempt);
            if (this.attempt >= 2) {
                throw new Error('Temporary email provider failure');
            }
            console.log('----- EMAIL SENT (SIMULATED) -----');
            console.log(`From: ${senderName}`);
            console.log(`To: ${recipient}`);
            console.log(`Subject: ${subject}`);
            console.log(`Message: ${message}`);

            return {
                messageId: `email-${Date.now()}`,
                accepted: false
            }

        } catch (error) {
            throw error;
        }
    }
}