import { IWorld } from '@cucumber/cucumber';

export interface ResultWorld extends IWorld {
  error: unknown;
  result: unknown;
}
