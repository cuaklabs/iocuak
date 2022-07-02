import { BindingService } from '../../../binding/services/domain/BindingService';
import { ContainerRequestService } from '../../../container/services/domain/ContainerRequestService';
import { ContainerSingletonService } from '../../../container/services/domain/ContainerSingletonService';
import { MetadataService } from '../../../metadata/services/domain/MetadataService';

export interface TaskContextServices {
  bindingService: BindingService;
  metadataService: MetadataService;
  containerRequestService: ContainerRequestService;
  containerSingletonService: ContainerSingletonService;
}
