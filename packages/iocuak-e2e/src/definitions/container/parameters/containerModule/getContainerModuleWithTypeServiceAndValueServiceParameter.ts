import {
  ContainerModule,
  ContainerModuleBindingService,
} from '@cuaklabs/iocuak';
import sinon from 'sinon';

import { getTypeServiceWithNoDependenciesParameter } from '../../../common/parameters/typeService/getTypeServiceWithNoDependenciesParameter';
import { TypeServiceParameter } from '../../../common/parameters/typeService/TypeServiceParameter';
import { getValueServiceParameter } from '../../../common/parameters/valueService/getValueServiceParameter';
import { ValueServiceParameter } from '../../../common/parameters/valueService/ValueServiceParameter';
import { ContainerModuleParameter } from './ContainerModuleParameter';

export function getContainerModuleWithTypeServiceAndValueServiceParameter(): ContainerModuleParameter {
  const typeServiceParameter: TypeServiceParameter =
    getTypeServiceWithNoDependenciesParameter();
  const valueServiceParameter: ValueServiceParameter =
    getValueServiceParameter();

  const loadSpy: sinon.SinonSpy = sinon.spy();

  const containerModule: ContainerModule = {
    load: (containerModuleBindingService: ContainerModuleBindingService) => {
      loadSpy(containerModuleBindingService);

      containerModuleBindingService.bind(typeServiceParameter.service);
      containerModuleBindingService.bindToValue({
        serviceId: valueServiceParameter.binding.id,
        value: valueServiceParameter.binding.value,
      });
    },
  };

  return {
    containerModule,
    loadSpy,
    typeServices: [typeServiceParameter],
    valueServices: [valueServiceParameter],
  };
}
