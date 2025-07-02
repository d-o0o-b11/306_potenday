import { Injectable } from "@nestjs/common";
import { InjectQueue } from "@nestjs/bullmq";
import { Queue } from "bullmq";
import { QueueName } from "../constants";

@Injectable()
export class SignInEmailService {
  constructor(
    @InjectQueue(QueueName.SIGN_IN_EMAIL) private readonly mailQueue: Queue
  ) {}

  async sendEmailJob() {
    await this.mailQueue.add(
      QueueName.SIGN_IN_EMAIL,
      {},
      {
        repeat: {
          pattern: "0 10 * * *", // 매일 오전 10시
        },
      }
    );
  }
}
