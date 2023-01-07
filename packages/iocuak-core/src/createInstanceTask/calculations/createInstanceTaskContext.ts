import { createInstanceFromBinding } from '../actions/createInstanceFromBinding';
import { getDependencies } from '../actions/getDependencies';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { TaskContextServices } from '../models/TaskContextServices';

export function createInstanceTaskContext(
  requestId: symbol,
  services: TaskContextServices,
): CreateInstanceTaskContext {
  const context: CreateInstanceTaskContext = {
    actions: {
      createInstanceFromBinding,
      getDependencies,
    },
    requestId: requestId,
    services,
    servicesInstantiatedSet: new Set(),
  };

  return context;
}
