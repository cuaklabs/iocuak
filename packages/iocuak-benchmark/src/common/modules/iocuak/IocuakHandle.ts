import { BindingScope, injectable } from '@cuaklabs/iocuak';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { Handle } from '../domain/Handle';

@injectable({
  id: serviceTypeToSymbolMap[ServiceType.handle],
  scope: BindingScope.singleton,
})
export class IocuakHandle implements Handle {
  public static instanceCounter: number = 0;

  constructor() {
    IocuakHandle.instanceCounter++;
  }

  public grab(): string {
    return 'grabbed!';
  }
}
