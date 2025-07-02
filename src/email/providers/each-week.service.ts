import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { QueueName } from "../constants";

@Injectable()
export class EachWeekEmailService {
  constructor(
    @InjectQueue(QueueName.EACH_WEEK_EMAIL) private readonly mailQueue: Queue
  ) {}

  async sendEmailJob() {
    await this.mailQueue.add(
      QueueName.EACH_WEEK_EMAIL,
      {},
      {
        repeat: {
          pattern: "0 10 * * 1", // 월요일 오전 10시
        },
      }
    );
  }
}
