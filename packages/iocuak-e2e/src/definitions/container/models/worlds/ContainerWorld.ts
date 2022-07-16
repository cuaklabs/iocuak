import { Container } from '@cuaklabs/iocuak';
import { IWorld } from '@cucumber/cucumber';

export interface ContainerWorld extends IWorld {
  container: Container;
}
