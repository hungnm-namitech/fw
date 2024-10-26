import * as aws from '@aws-sdk/client-ses';
import { defaultProvider } from '@aws-sdk/credential-provider-node';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createTransport, Transporter } from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import SESTransport from 'nodemailer/lib/ses-transport';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { SendMailException } from 'src/exceptions/send-mail-exception';
import { MAIL_TRANSPORTERS } from 'src/mailer/email.constants';
@Injectable()
export class EmailService {
  constructor(private readonly configService: ConfigService) {}
  private readonly ses = new aws.SES({
    apiVersion: '2010-12-01',
    region: this.configService.get('AWS_DEFAULT_REGION'),
    credentialDefaultProvider: defaultProvider,
  });

  private readonly mailTransport: Transporter<
    SESTransport.SentMessageInfo | SMTPTransport.SentMessageInfo
  > =
    this.configService.get('MAIL_TRANSPORTER') === MAIL_TRANSPORTERS.AWS
      ? createTransport({
          SES: { ses: this.ses, aws },
        })
      : createTransport({
          host: this.configService.get('MAIL_HOST'),
          port: Number(this.configService.get('MAIL_PORT')),
          auth: {
            user: this.configService.get('MAIL_AUTH_USER'),
            pass: this.configService.get('MAIL_AUTH_PASSWORD'),
          },
        });
  async sendMail(mailInfo: Mail.Options) {
    try {
      await this.mailTransport.sendMail(mailInfo);
      this.mailTransport.close();
    } catch (error) {
      console.error(error);
      throw new SendMailException();
    }
  }
}
