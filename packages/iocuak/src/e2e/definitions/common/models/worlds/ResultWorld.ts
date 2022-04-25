import { IWorld } from '@cucumber/cucumber';

export interface ResultWorld extends IWorld {
  result: unknown;
}
