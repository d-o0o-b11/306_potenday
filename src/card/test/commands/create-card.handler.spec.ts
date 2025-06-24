import { EntityManager } from "typeorm";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { CreateCardCommand, CreateCardCommandHandler } from "../../commands";
import { Card as CardEntity, MockEntityManager } from "src/database";

describe("CreateCardCommandHandler", () => {
  let handler: CreateCardCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CreateCardCommandHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<CreateCardCommandHandler>(CreateCardCommandHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    it("카드를 생성한다", async () => {
      const command = new CreateCardCommand(
        "리팩토링",
        "306 프로젝트 리팩토링",
        120,
        80,
        randomUUID(), // folderId
        randomUUID() // userId
      );

      const insert = jest.spyOn(manager, "insert");

      await handler.execute(command);

      expect(insert).toHaveBeenCalledTimes(1);
      expect(insert).toHaveBeenCalledWith(
        CardEntity,
        expect.objectContaining({
          id: expect.any(String),
          title: command.title,
          context: command.context,
          top: command.top,
          left: command.left,
          folderId: command.folderId,
          userId: command.userId,
          finishDate: null,
          foldedState: false,
        })
      );
    });
  });
});
