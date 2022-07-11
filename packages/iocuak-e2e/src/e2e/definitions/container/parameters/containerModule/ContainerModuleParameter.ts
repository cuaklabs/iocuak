import { ContainerModule } from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { TypeServiceParameter } from '../../../common/parameters/typeService/TypeServiceParameter';
import { ValueServiceParameter } from '../../../common/parameters/valueService/ValueServiceParameter';

export interface ContainerModuleParameter {
  containerModule: ContainerModule;
  loadSpy: sinon.SinonSpy;
  typeServices: TypeServiceParameter[];
  valueServices: ValueServiceParameter[];
}
