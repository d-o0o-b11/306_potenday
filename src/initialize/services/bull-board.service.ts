import { createBullBoard } from "@bull-board/api";
import { ExpressAdapter } from "@bull-board/express";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { Queue } from "bullmq";
import { INestApplication, Injectable } from "@nestjs/common";

@Injectable()
export class BullBoardInitializer {
  async initialize(app: INestApplication) {
    /**
     * NestJS 내부에서 BullMQ queue provider는
     * "BullQueue_" + queueName 이름으로 등록됩니다.
     */
    const signInQueue = app.get<Queue>("BullQueue_sign-in-email");
    const eachWeekQueue = app.get<Queue>("BullQueue_each-week-email");

    const serverAdapter = new ExpressAdapter();
    serverAdapter.setBasePath("/bull-board");

    createBullBoard({
      queues: [
        new BullMQAdapter(signInQueue),
        new BullMQAdapter(eachWeekQueue),
      ],
      serverAdapter,
    });

    app.use("/bull-board", serverAdapter.getRouter());
  }
}
