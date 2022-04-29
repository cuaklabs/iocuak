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

  const containerModule: ContainerModuleApi = {
    load: (
      containerModuleBindingServiceApi: ContainerModuleBindingServiceApi,
    ) => {
      containerModuleBindingServiceApi.bind(typeServiceParameter.service);
      containerModuleBindingServiceApi.bindToValue(
        valueServiceParameter.binding.id,
        valueServiceParameter.binding.value,
      );
    },
  };

  return {
    containerModule,
    typeServices: [typeServiceParameter],
    valueServices: [valueServiceParameter],
  };
}
