import twilio from 'twilio'

class TwilioService {
    constructor() {
        this.client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN)
    }

    async sendSMS(to, body) {
        return this.client.messages.create({
            body,
            to,
            from: process.env.TWILIO_PHONE_NUMBER,
        })
    }
}

export default new TwilioService()
