import { Injectable } from "@nestjs/common";

@Injectable()
export class EmailService {
    async send(to: string, message: string): Promise<void> {

        if (process.env.NODE_ENV === 'production') {
            console.log('Sending real email...');
        } else if (process.env.NODE_ENV === 'test') {
            console.log('Capturing email for testing...');
        } else {
            console.log('Printing email in terminal...');
        }

    }
}