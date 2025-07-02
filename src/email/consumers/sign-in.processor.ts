import { MailerService } from "@nestjs-modules/mailer";
import { InjectEntityManager } from "@nestjs/typeorm";
import { Job } from "bullmq";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { User } from "src/database";
import { Between, EntityManager, IsNull, Not } from "typeorm";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueName } from "../constants";

@Processor(QueueName.SIGN_IN_EMAIL)
export class SignInEmailConsumer extends WorkerHost {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly mailerService: MailerService
  ) {
    super();
  }

  async process(job: Job): Promise<any> {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const userList = await this.manager.find(User, {
      where: {
        createdAt: Between(yesterdayStart, yesterdayEnd),
        emailActive: true,
        email: Not(IsNull()), // 이메일이 존재하는 사용자
      },
    });

    for await (const user of userList) {
      await this.mailerService.sendMail({
        to: user.email,
        subject: `👋🏻환영해요! 1일차 위셔 ${user.name}님`,
        template: "welcome-signin",
        context: {
          userName: user.name,
        },
      });
    }
  }
}
