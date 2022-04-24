import { ContainerModuleTaskKind } from '../../models/domain/ContainerModuleTaskKind';
import { ContainerModuleTaskKindType } from '../../models/domain/ContainerModuleTaskKindType';

export function isContainerModuleTaskKind(
  value: unknown,
): value is ContainerModuleTaskKind {
  const taskKind: ContainerModuleTaskKind = value as ContainerModuleTaskKind;

  return Object.values(ContainerModuleTaskKindType).includes(taskKind.type);
}
