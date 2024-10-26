import { User } from '@prisma/client';
import Mail from 'nodemailer/lib/mailer';
import { EmailTemplateStrategy } from './index';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UpdateUserMailTemplateStrategy implements EmailTemplateStrategy {
  constructor(private readonly configService: ConfigService) {}

  buildTemplate(user: User): Mail.Options {
    return {
      from: this.configService.get('ADMIN_EMAIL'),
      to: user.mailAddress,
      subject: `${this.configService.get(
        'SYSTEM_NAME',
      )}アカウント更新完了のお知らせ`,
      html: `<p>${user.username} 様</p>
        
<p>アカウントの更新が完了いたしました。</p>
<p>更新内容をお送りいたします。</p>
        
<p>━━━━━━━━━━━━━━━━━━━━━━  登録内容  ━━━━━━━━━━━━━━━━━━━━━━</p>
        
<p>お名前：${user.username}</p>
        
<p>メールアドレス：${user.mailAddress}</p>
        
<p>ログインID: ${user.userId}</p>

<p>※画面から設定頂いたパスワードはセキュリティ上表示しておりません。</p>
        
<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>


<p>資材配送システム のご利用は、下記ページからログイン頂けます。</p>
<a href="${this.configService.get(
        'FE_BASE_URL',
      )}/login" target="_blank" rel="noopener">${this.configService.get(
        'FE_BASE_URL',
      )}/login</a>
`,
    };
  }
}
