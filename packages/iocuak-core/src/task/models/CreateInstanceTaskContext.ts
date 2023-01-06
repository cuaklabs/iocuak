import { ServiceId } from '@cuaklabs/iocuak-common';

import { TaskContextActions } from './TaskContextActions';
import { TaskContextServices } from './TaskContextServices';

export interface CreateInstanceTaskContext {
  readonly actions: TaskContextActions;
  readonly requestId: symbol;
  readonly services: TaskContextServices;
  readonly containerModulesLoadedSet: Set<ServiceId>;
}
