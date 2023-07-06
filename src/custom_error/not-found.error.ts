export class NotFoundError extends Error {
  // constructor overriding
  //삭제하기
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
