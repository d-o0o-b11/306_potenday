import { ID } from "../id";

export interface CreateDomainEntityProps<
  DomainID extends ID<unknown>,
  DomainProps
> {
  id: DomainID;
  props: DomainProps;
}
