import { env } from '../config/env.js'

type PostmarkMessage = {
  to: string
  subject: string
  htmlBody: string
  textBody?: string
}

export const sendEmail = async (message: PostmarkMessage): Promise<void> => {
  if (!env.POSTMARK_SERVER_TOKEN || !env.POSTMARK_FROM_EMAIL) {
    throw new Error('Postmark is not configured')
  }

  const response = await fetch('https://api.postmarkapp.com/email', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Postmark-Server-Token': env.POSTMARK_SERVER_TOKEN,
    },
    body: JSON.stringify({
      From: env.POSTMARK_FROM_EMAIL,
      To: message.to,
      Subject: message.subject,
      HtmlBody: message.htmlBody,
      TextBody: message.textBody,
      MessageStream: env.POSTMARK_MESSAGE_STREAM,
    }),
  })

  if (!response.ok) {
    throw new Error(`Postmark request failed with status ${response.status}`)
  }
}
