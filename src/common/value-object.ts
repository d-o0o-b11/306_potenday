export abstract class ValueObject<T> {
  protected readonly _value: T;

  constructor(value: T) {
    this._value = value;
    this.validate();
    Object.freeze(this);
  }

  get value(): T {
    return this._value;
  }

  equals(vo?: ValueObject<T>): boolean {
    if (vo === null || vo === undefined) return false;
    if (!(vo instanceof ValueObject)) return false;
    return this.value === vo.value;
  }

  protected abstract validate(): void;
}
