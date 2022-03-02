import { ContainerBindingApiService } from './ContainerBindingApiService';
import { ContainerInstanceApiService } from './ContainerInstanceApiService';
import { ContainerModuleApiService } from './ContainerModuleApiService';

export interface ContainerApiService
  extends ContainerBindingApiService,
    ContainerInstanceApiService,
    ContainerModuleApiService {}
