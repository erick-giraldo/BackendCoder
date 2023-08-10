import twilio from 'twilio'
import config from '../config/index.js'
class TwilioService {
    constructor() {
        this.client = twilio(config.twilioAccountSid, config.twilioAuthToken)
    }

    async sendSMS(to, body) {
        return this.client.messages.create({
            body,
            to,
            from: config.twilioPhoneNumber,
        })
    }
}

export default new TwilioService()
