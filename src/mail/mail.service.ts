import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SendMailClient } from 'zeptomail';

@Injectable()
export class MailService {
  private client: SendMailClient;
  private readonly logger = new Logger(MailService.name);
  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('MAIL_TOKEN');
    const url = this.configService.get<string>('MAIL_URL');
    this.client = new SendMailClient({ url, token });
  }

  async sendMail(
    toEmail: string,
    toName: string,
    templateKeyName: string,
    merge_info: unknown,
  ) {
    const fromAddress = this.configService.get<string>('FROM_ADDRESS');
    const fromName = this.configService.get<string>('FROM_NAME');
    const templatekey = this.configService.get<string>(templateKeyName);

    try {
      await this.client.sendMailWithTemplate({
        template_key: templatekey,

        from: {
          address: fromAddress,
          name: fromName,
        },
        to: [
          {
            email_address: {
              address: toEmail,
              name: toName,
            },
          },
        ],
        merge_info,
      });
    } catch (error) {
      this.logger.error(`Failed to send email to ${toEmail}.`, error);
    }
  }
}
