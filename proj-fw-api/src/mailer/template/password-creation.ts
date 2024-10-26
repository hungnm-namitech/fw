import { User } from '@prisma/client';
import Mail from 'nodemailer/lib/mailer';
import { EmailTemplateStrategy } from './index';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PasswordCreationMailTemplateStrategy
  implements EmailTemplateStrategy
{
  constructor(private readonly configService: ConfigService) {}
  buildTemplate(user: User, password: string): Mail.Options {
    return {
      from: this.configService.get('ADMIN_EMAIL'),
      to: user.mailAddress,
      subject: `${this.configService.get(
        'SYSTEM_NAME',
      )}パスワード初期化のお知らせ。`,
      html: `<p>${user.username} 様のパスワードを初期化いたしました。</p>
        
<p>登録内容をお送りします。</p>
        
<p>━━━━━━━━━━━━━━━━━━━━━━  登録内容  ━━━━━━━━━━━━━━━━━━━━━━</p>
        
<p>お名前：${user.username}</p>
        
<p>ログインID: ${user.userId}</p>
        
<p>パスワード：${password}</p>


<p>※パスワードはこのままご利用いただけますが、セキュリティ上変更することを</p>
<p>　おすすめいたします。</p>


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
