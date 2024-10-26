import { User } from '@prisma/client';
import Mail from 'nodemailer/lib/mailer';
import { EmailTemplateStrategy } from './index';
import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CreateUserMailTemplateStrategy implements EmailTemplateStrategy {
  constructor(private readonly configService: ConfigService) {}

  buildTemplate(user: User, password: string): Mail.Options {
    return {
      from: this.configService.get('ADMIN_EMAIL'),
      to: user.mailAddress,
      subject: `${this.configService.get(
        'SYSTEM_NAME',
      )}アカウント登録完了のお知らせ`,
      html: `<p>${user.username} 様</p>
        
<p>アカウントの登録が完了いたしました。</p>
<p>登録内容をお送りいたします。</p>
        
<p>━━━━━━━━━━━━━━━━━━━━━━  登録内容  ━━━━━━━━━━━━━━━━━━━━━━</p>
        
<p>お名前：${user.username}</p>
        
<p>メールアドレス：${user.mailAddress}</p>
        
<p>ログインID: ${user.userId}</p>
        
<p>パスワード：${password}</p>
        
<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>


<p>${this.configService.get(
        'SYSTEM_NAME',
      )}のご利用は、下記ページからログイン頂けます。</p>
<a href="${this.configService.get(
        'FE_BASE_URL',
      )}/login" target="_blank" rel="noopener">${this.configService.get(
        'FE_BASE_URL',
      )}/login</a>
`,
    };
  }
}
