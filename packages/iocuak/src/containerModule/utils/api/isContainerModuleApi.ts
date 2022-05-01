import { isFunction } from '../../../common/utils/isFunction';
import { ContainerModuleApi } from '../../models/api/ContainerModuleApi';

export function isContainerModuleApi(
  value: unknown,
): value is ContainerModuleApi {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  return isFunction((value as ContainerModuleApi).load);
}
