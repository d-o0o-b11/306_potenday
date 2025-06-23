import { EntityManager } from "typeorm";
import { InfoQuery, InfoQueryHandler } from "../../queries";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { MockEntityManager, User } from "src/database";

describe("InfoQueryHandler", () => {
  let handler: InfoQueryHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InfoQueryHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<InfoQueryHandler>(InfoQueryHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  const infoQuery = new InfoQuery(randomUUID());

  describe("execute", () => {
    it("사용자 정보를 조회한다", async () => {
      const mockUser = {
        id: infoQuery.userId,
        name: "Test User",
        email: "test@example.com",
        emailActive: true,
        profile: "https://example.com/profile.jpg",
      } as any;

      const findOne = jest
        .spyOn(manager, "findOne")
        .mockResolvedValue(mockUser);

      const result = await handler.execute(infoQuery);

      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith(User, {
        where: { id: infoQuery.userId },
      });
      expect(result).toEqual({
        userId: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        emailActive: mockUser.emailActive,
        profile: mockUser.profile,
      });
    });

    it("사용자를 찾을 수 없을 경우 예외를 발생한다", async () => {
      const findOne = jest.spyOn(manager, "findOne").mockResolvedValue(null);

      await expect(handler.execute(infoQuery)).rejects.toThrow(
        "User not found"
      );

      expect(findOne).toHaveBeenCalledTimes(1);
      expect(findOne).toHaveBeenCalledWith(User, {
        where: { id: infoQuery.userId },
      });
    });
  });
});
