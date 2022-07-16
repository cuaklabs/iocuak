import { Newable, TypeBinding } from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { ValueServiceParameter } from '../valueService/ValueServiceParameter';

export interface TypeServiceParameter {
  binding: TypeBinding;
  dependencies?: (TypeServiceParameter | ValueServiceParameter)[];
  service: Newable;
  spy: sinon.SinonSpy;
}
