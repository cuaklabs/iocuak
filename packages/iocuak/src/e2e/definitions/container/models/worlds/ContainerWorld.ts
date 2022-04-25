import { IWorld } from '@cucumber/cucumber';

import { ContainerApi } from '../../../../../container/modules/api/ContainerApi';

export interface ContainerWorld extends IWorld {
  container: ContainerApi;
}
