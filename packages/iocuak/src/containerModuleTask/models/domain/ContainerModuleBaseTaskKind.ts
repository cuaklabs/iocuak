import { ContainerModuleTaskKindType } from './ContainerModuleTaskKindType';

export interface ContainerModuleBaseTaskKind<
  TTaskKindType extends ContainerModuleTaskKindType = ContainerModuleTaskKindType,
> {
  type: TTaskKindType;
}
