import { EntityManager } from "typeorm";
import { UpdateInfoCommand, UpdateInfoCommandHandler } from "../../commands";
import { Test, TestingModule } from "@nestjs/testing";
import { randomUUID } from "crypto";
import { MockEntityManager, User } from "src/database";

describe("UpdateInfoCommandHandler", () => {
  let handler: UpdateInfoCommandHandler;
  let manager: EntityManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UpdateInfoCommandHandler,
        {
          provide: EntityManager,
          useFactory: MockEntityManager,
        },
      ],
    }).compile();

    handler = module.get<UpdateInfoCommandHandler>(UpdateInfoCommandHandler);
    manager = module.get<EntityManager>(EntityManager);
  });

  describe("execute", () => {
    const userEntity = {
      id: randomUUID(),
      name: "old Name",
      email: "old@example.com",
      emailActive: true,
      profile: "profile-url",
    } as any;

    it("사용자 정보를 업데이트한다", async () => {
      const command = new UpdateInfoCommand(
        userEntity.id,
        "New Name",
        "new@example.com",
        true
      );

      const findOne = jest
        .spyOn(manager, "findOne")
        .mockResolvedValueOnce(userEntity)
        .mockResolvedValueOnce({
          ...userEntity,
          name: command.name,
          email: command.email,
          emailActive: command.emailActive,
        });

      const update = jest.spyOn(manager, "update").mockResolvedValue({
        affected: 1,
      } as any);

      const result = await handler.execute(command);

      expect(findOne).toHaveBeenCalledTimes(2);
      expect(findOne).toHaveBeenNthCalledWith(1, User, {
        where: { id: command.userId },
      });
      expect(findOne).toHaveBeenNthCalledWith(2, User, {
        where: { id: command.userId },
      });

      expect(update).toHaveBeenCalledTimes(1);
      expect(update).toHaveBeenCalledWith(
        User,
        command.userId,
        expect.objectContaining({
          id: command.userId,
          name: command.name,
          email: command.email,
          emailActive: command.emailActive,
          profile: userEntity.profile,
        })
      );

      expect(result).toEqual({
        userId: command.userId,
        name: command.name,
        email: command.email,
        emailActive: command.emailActive,
        profile: userEntity.profile,
      });
    });

    it("name만 업데이트한다", async () => {
      const command = new UpdateInfoCommand(
        userEntity.id,
        "New Name",
        userEntity.email,
        userEntity.emailActive
      );

      jest
        .spyOn(manager, "findOne")
        .mockResolvedValueOnce(userEntity)
        .mockResolvedValueOnce({
          ...userEntity,
          name: command.name,
        });

      jest.spyOn(manager, "update").mockResolvedValue({
        affected: 1,
      } as any);

      const result = await handler.execute(command);

      expect(result.name).toBe(command.name);
      expect(result.email).toBe(userEntity.email);
      expect(result.emailActive).toBe(userEntity.emailActive);
    });

    it("email만 업데이트한다", async () => {
      const command = new UpdateInfoCommand(
        userEntity.id,
        userEntity.name,
        "onlynewemail@example.com",
        userEntity.emailActive
      );

      jest
        .spyOn(manager, "findOne")
        .mockResolvedValueOnce(userEntity)
        .mockResolvedValueOnce({
          ...userEntity,
          email: command.email,
        });

      jest.spyOn(manager, "update").mockResolvedValue({
        affected: 1,
      } as any);

      const result = await handler.execute(command);

      expect(result.email).toBe(command.email);
      expect(result.name).toBe(userEntity.name);
      expect(result.emailActive).toBe(userEntity.emailActive);
    });

    it("emailActive만 업데이트한다", async () => {
      const command = new UpdateInfoCommand(
        userEntity.id,
        userEntity.name,
        userEntity.email,
        false
      );

      jest
        .spyOn(manager, "findOne")
        .mockResolvedValueOnce(userEntity)
        .mockResolvedValueOnce({
          ...userEntity,
          emailActive: command.emailActive,
        });

      jest.spyOn(manager, "update").mockResolvedValue({
        affected: 1,
      } as any);

      const result = await handler.execute(command);

      expect(result.emailActive).toBe(command.emailActive);
      expect(result.name).toBe(userEntity.name);
      expect(result.email).toBe(userEntity.email);
    });

    it("사용자를 찾을 수 없을 경우 예외를 발생한다", async () => {
      const command = new UpdateInfoCommand(
        randomUUID(),
        "New Name",
        "new@example.com",
        true
      );

      jest.spyOn(manager, "findOne").mockResolvedValue(null);

      await expect(handler.execute(command)).rejects.toThrow("User not found");
    });

    it("사용자 업데이트에 실패할 경우 예외를 발생한다", async () => {
      const command = new UpdateInfoCommand(
        userEntity.id,
        "New Name",
        "test@example.com",
        true
      );

      jest.spyOn(manager, "findOne").mockResolvedValueOnce(userEntity);
      jest.spyOn(manager, "update").mockResolvedValue({ affected: 0 } as any);
      await expect(handler.execute(command)).rejects.toThrow(
        "User update failed"
      );
    });
  });
});
