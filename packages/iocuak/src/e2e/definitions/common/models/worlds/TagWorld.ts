import { IWorld } from '@cucumber/cucumber';

import { BindingTag } from '../../../../../binding/models/domain/BindingTag';

export interface TagWorld extends IWorld {
  tag: BindingTag;
}
