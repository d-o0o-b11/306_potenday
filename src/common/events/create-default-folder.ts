import { IEvent } from "@nestjs/cqrs";

export interface CreateDefaultFolderEventProps {
  readonly userId: string;
}

/**
 * 기본 폴더 생성 이벤트
 * - 회원가입한 유저의 기본 폴더를 생성하기 위한 이벤트
 */
export class CreateDefaultFolderEvent implements IEvent {
  constructor(public readonly props: CreateDefaultFolderEventProps) {}

  static from(props: CreateDefaultFolderEventProps): CreateDefaultFolderEvent {
    return new CreateDefaultFolderEvent(props);
  }

  static getEventName(): string {
    return "CreateFinalGoalEvent";
  }
}
