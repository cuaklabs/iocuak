import { createInstanceFromBinding } from '../actions/createInstanceFromBinding';
import { getDependencies } from '../actions/getDependencies';
import { CreateInstanceTaskContext } from '../models/CreateInstanceTaskContext';
import { TaskContextActions } from '../models/TaskContextActions';
import { TaskContextServices } from '../models/TaskContextServices';

const taskContextActions: TaskContextActions = {
  createInstanceFromBinding,
  getDependencies,
};

export function createCreateInstanceTaskContext(
  requestId: symbol,
  services: TaskContextServices,
): CreateInstanceTaskContext {
  const context: CreateInstanceTaskContext = {
    actions: taskContextActions,
    requestId: requestId,
    services,
    servicesInstantiatedSet: new Set(),
  };

  return context;
}
