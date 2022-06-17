import { TaskKindType } from '../domain/TaskKindType';

export enum TaskGraphExpandCommandType {
  createInstance = TaskKindType.createInstance,
  getInstanceDependencies = TaskKindType.getInstanceDependencies,
}
