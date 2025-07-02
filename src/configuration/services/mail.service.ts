import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { MailConfig } from "../config";
import { ConfigurationName } from "../common";

@Injectable()
export class MailConfigService {
  constructor(private readonly configService: ConfigService) {}

  get userID(): string {
    return this.configService.getOrThrow<MailConfig>(ConfigurationName.MAIL)
      .user;
  }

  get userPW(): string {
    return this.configService.getOrThrow<MailConfig>(ConfigurationName.MAIL)
      .pass;
  }
}
