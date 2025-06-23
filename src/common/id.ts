export abstract class ID<IDProps> {
  private readonly _value: IDProps;

  constructor(value: IDProps) {
    this._value = value;
    this.validate();
  }

  protected get value(): IDProps {
    return this._value;
  }

  public unpack(): IDProps {
    return this._value;
  }

  public abstract equals(id: ID<IDProps>): boolean;
  public abstract validate(): void;
}
