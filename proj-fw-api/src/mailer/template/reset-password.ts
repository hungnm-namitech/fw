import { User } from '@prisma/client';
import Mail from 'nodemailer/lib/mailer';
import { EmailTemplateStrategy } from './index';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ResetPasswordMailTemplateStrategy
  implements EmailTemplateStrategy
{
  constructor(private readonly configService: ConfigService) {}

  buildTemplate(user: User, password: string): Mail.Options {
    const pageLink = `${this.configService.get('FE_BASE_URL')}/login`;
    const systemName = this.configService.get('SYSTEM_NAME');

    const html = `<p style="margin: 0">${user.username} 様</p>
<p style="margin-bottom: 0">パスワードを再発行いたしました。</p>
<p style="margin: 0">登録内容をお送りします。</p>


<p style="margin-top: 30px">━━━━━━━━━━━━━━━━  登録内容  ━━━━━━━━━━━━━━━━</p>

<p>お名前: ${user.username}</p>
<p>メールアドレス: ${user.mailAddress}</p>
<p>ログインID: ${user.userId}</p>
<p>パスワード: ${password}</p>


<p style="margin: 0; margin-top: 30px">※パスワードはこのままご利用いただけますが、セキュリティ上変更することを</p>
<p style="margin: 0">　おすすめいたします。</p>

<p>━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━</p>

<p style="margin: 0; margin-top: 30px">${systemName}のご利用は、下記ページからログイン頂けます。</p>
<a href="${pageLink}">${pageLink}</a>`;

    return {
      from: this.configService.get('ADMIN_EMAIL'),
      to: user.mailAddress,
      subject: `${this.configService.get(
        'SYSTEM_NAME',
      )}パスワード初期化のお知らせ。`,
      html: html,
    };
  }
}
