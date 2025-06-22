import { ID } from "./id";
import { CreateDomainEntityProps } from "./types/entity.type";
import { UUID } from "./types";

export abstract class DomainEntity<
  DomainID extends ID<unknown> = UUID,
  DomainProps = object
> {
  /**
   * 도메인 엔티티 식별자
   */
  protected readonly _id!: DomainID;
  /**
   * 도메인 엔티티 속성
   */
  protected readonly props: DomainProps;

  constructor({ props, id }: CreateDomainEntityProps<DomainID, DomainProps>) {
    this._id = id;
    this.props = props;
    this.validate();
  }

  public get id(): DomainID {
    return this._id;
  }

  public getProps(): DomainProps {
    return Object.freeze({
      ...this.props,
      id: this._id,
    });
  }

  public equals(entity: DomainEntity<DomainID, DomainProps>): boolean {
    return this.id.equals(entity.id);
  }

  public abstract validate(): void;
}
