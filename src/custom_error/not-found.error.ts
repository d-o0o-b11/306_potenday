export class NotFoundError extends Error {
  // constructor overriding
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
