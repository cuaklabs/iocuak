import { Container } from '@cuaklabs/iocuak';

import { IocuakHandle } from './IocuakHandle';
import { IocuakKatana } from './IocuakKatana';
import { IocuakNinja } from './IocuakNinja';
import { IocuakShuriken } from './IocuakShuriken';

export const iocuakContainer: Container = Container.build();

iocuakContainer.bind(IocuakHandle);
iocuakContainer.bind(IocuakNinja);
iocuakContainer.bind(IocuakKatana);
iocuakContainer.bind(IocuakShuriken);
