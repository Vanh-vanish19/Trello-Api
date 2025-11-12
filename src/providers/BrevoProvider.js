import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

import { env } from '~/config/environment'

let emailAPI = new TransactionalEmailsApi()
emailAPI.authentications.apiKey.apiKey = env.BREVO_API_KEY


const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  // khoi tao message
  let message = new SendSmtpEmail()
  // tk gui mail
  message.sender = { email: env.ADMIN_EMAIL_ADDRESS, name: env.ADMIN_EMAIL_NAME }

  // accounts nhan mail
  message.to = [{ email: recipientEmail }]

  // title email
  message.subject = customSubject

  message.htmlContent = htmlContent

  // call action to send mail
  return emailAPI.sendTransacEmail(message)
}

export const BrevoProvider = {
  sendEmail
}