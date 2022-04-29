import sinon from 'sinon';

import { ContainerModuleApi } from '../../../../../container/modules/api/ContainerModuleApi';
import { ContainerModuleBindingServiceApi } from '../../../../../container/services/api/ContainerModuleBindingServiceApi';
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

  // eslint-disable-next-line import/no-named-as-default-member
  const loadSpy: sinon.SinonSpy = sinon.spy();

  const containerModule: ContainerModuleApi = {
    load: (
      containerModuleBindingServiceApi: ContainerModuleBindingServiceApi,
    ) => {
      loadSpy(containerModuleBindingServiceApi);

      containerModuleBindingServiceApi.bind(typeServiceParameter.service);
      containerModuleBindingServiceApi.bindToValue(
        valueServiceParameter.binding.id,
        valueServiceParameter.binding.value,
      );
    },
  };

  return {
    containerModule,
    loadSpy,
    typeServices: [typeServiceParameter],
    valueServices: [valueServiceParameter],
  };
}
