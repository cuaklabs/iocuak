import { BindingTag } from '@cuaklabs/iocuak';
import { IWorld } from '@cucumber/cucumber';

export interface TagWorld extends IWorld {
  tag: BindingTag;
}
