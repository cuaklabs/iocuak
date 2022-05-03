import { BindingServiceApi } from '../../../binding/services/api/BindingServiceApi';

export type ContainerModuleBindingServiceApi = Pick<
  BindingServiceApi,
  'bind' | 'bindToValue'
>;
