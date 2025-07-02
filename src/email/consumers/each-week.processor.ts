import { MailerService } from "@nestjs-modules/mailer";
import { InjectEntityManager } from "@nestjs/typeorm";
import { Job } from "bullmq";
import { endOfDay, startOfDay, subDays } from "date-fns";
import { User } from "src/database";
import { Between, EntityManager, IsNull, Not } from "typeorm";
import { Processor, WorkerHost } from "@nestjs/bullmq";
import { QueueName } from "../constants";

@Processor(QueueName.EACH_WEEK_EMAIL)
export class EachWeekEmailConsumer extends WorkerHost {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly mailerService: MailerService
  ) {
    super();
  }

  async process(job: Job) {
    const yesterday = subDays(new Date(), 1);
    const yesterdayStart = startOfDay(yesterday);
    const yesterdayEnd = endOfDay(yesterday);

    const userList = await this.manager.find(User, {
      where: {
        createdAt: Not(Between(yesterdayStart, yesterdayEnd)), // 어제 가입한 사용자 제외
        emailActive: true,
        email: Not(IsNull()), // 이메일이 존재하는 사용자
      },
    });

    for await (const user of userList) {
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
}
