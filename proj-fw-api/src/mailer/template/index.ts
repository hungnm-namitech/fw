import Mail from 'nodemailer/lib/mailer';

export interface EmailTemplateStrategy {
  buildTemplate(...args: any[]): Mail.Options;
}
