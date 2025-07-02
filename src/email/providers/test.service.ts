import { MailerService } from "@nestjs-modules/mailer";
import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import * as path from "path";
import { User } from "src/database";
import { EntityManager } from "typeorm";

@Injectable()
export class EmailTestService {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly mailerService: MailerService
  ) {}

  async signInTest() {
    const user = await this.manager.findOneOrFail(User, {
      where: {
        name: "지민",
      },
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: `👋🏻환영해요! 1일차 위셔 ${user.name}님`,
      template: "welcome-signin",
      context: {
        userName: user.name,
      },
    });
  }

  async eachWeekTest() {
    const user = await this.manager.findOneOrFail(User, {
      where: {
        name: "지민",
      },
    });

    await this.mailerService.sendMail({
      to: user.email,
      subject: `🗓️ 위슈와 맞이하는 한 주의 시작!`,
      template: "weekly-reminder",
      context: {
        userName: user.name,
      },
    });
  }
}
