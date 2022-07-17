import { Tag } from '@cuaklabs/iocuak-common';
import { IWorld } from '@cucumber/cucumber';

export interface TagWorld extends IWorld {
  tag: Tag;
}
