import { ContainerBindingServiceApi } from './ContainerBindingServiceApi';

export type ContainerModuleBindingServiceApi = Pick<
  ContainerBindingServiceApi,
  'bind' | 'bindToValue'
>;
