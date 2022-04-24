import { BindingApi } from '../../../../../metadata/models/api/BindingApi';
import { ContainerWorld } from './ContainerWorld';

export interface ContainerBindingGetMetadataWorld extends ContainerWorld {
  expectedBinding: BindingApi;
  result: BindingApi[];
}
