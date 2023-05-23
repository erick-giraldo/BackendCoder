import nodemailer from 'nodemailer'

class messageService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'outlook',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    })
  }

  sendEmail(to, subject, html, attachments = []) {
    return this.transporter.sendMail({
      from: process.env.EMAIL_USER,
      to,
      subject,
      html,
      attachments,
    })
  }
}

export default new messageService();