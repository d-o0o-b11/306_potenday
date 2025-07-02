jest.mock("@bull-board/api", () => ({
  createBullBoard: jest.fn(),
}));

jest.mock("@bull-board/api/bullMQAdapter", () => {
  return {
    BullMQAdapter: jest.fn().mockImplementation(() => "BullMQ_ADAPTER"),
  };
});

jest.mock("@bull-board/express", () => {
  return {
    ExpressAdapter: jest.fn().mockImplementation(() => ({
      setBasePath: jest.fn(),
      getRouter: jest.fn().mockReturnValue("BULL_BOARD_ROUTER"),
    })),
  };
});

import { BullBoardInitializer } from "../services";
import { INestApplication } from "@nestjs/common";
import { Queue } from "bullmq";
import { createBullBoard } from "@bull-board/api";
import { BullMQAdapter } from "@bull-board/api/bullMQAdapter";
import { ExpressAdapter } from "@bull-board/express";

describe("BullBoardInitializer", () => {
  let app: INestApplication;
  let initializer: BullBoardInitializer;
  let signInQueue: Queue;
  let eachWeekQueue: Queue;

  beforeEach(() => {
    signInQueue = {} as Queue;
    eachWeekQueue = {} as Queue;

    app = {
      get: jest.fn((token) => {
        if (token === "BullQueue_sign-in-email") return signInQueue;
        if (token === "BullQueue_each-week-email") return eachWeekQueue;
      }),
      use: jest.fn(),
    } as unknown as INestApplication;

    initializer = new BullBoardInitializer();
  });

  it("BullBoard가 정상적으로 초기화되어야 한다.", async () => {
    await initializer.initialize(app);

    expect(app.get).toHaveBeenCalledWith("BullQueue_sign-in-email");
    expect(app.get).toHaveBeenCalledWith("BullQueue_each-week-email");

    expect(ExpressAdapter).toHaveBeenCalledTimes(1);

    const instance = (ExpressAdapter as jest.Mock).mock.results[0].value;

    expect(instance.setBasePath).toHaveBeenCalledWith("/bull-board");

    expect(BullMQAdapter).toHaveBeenCalledWith(signInQueue);
    expect(BullMQAdapter).toHaveBeenCalledWith(eachWeekQueue);

    const adapter1 = new BullMQAdapter(signInQueue);
    const adapter2 = new BullMQAdapter(eachWeekQueue);

    expect(createBullBoard).toHaveBeenCalledWith({
      queues: [adapter1, adapter2],
      serverAdapter: instance,
    });

    expect(app.use).toHaveBeenCalledWith("/bull-board", "BULL_BOARD_ROUTER");
  });
});
