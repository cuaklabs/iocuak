import { INestApplicationContext, Module } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';

import { ServiceType } from '../../models/domain/ServiceType';
import { serviceTypeToSymbolMap } from '../../models/domain/serviceTypeToSymbolMap';
import { NestJsHandle } from './NestJsHandle';
import { NestJsKatana } from './NestJsKatana';
import { NestJsNinja } from './NestJsNinja';
import { NestJsShuriken } from './NestJsShuriken';

@Module({
  imports: [],
  providers: [
    {
      provide: serviceTypeToSymbolMap[ServiceType.handle],
      useClass: NestJsHandle,
    },
    {
      provide: serviceTypeToSymbolMap[ServiceType.throwableWeapon],
      useClass: NestJsShuriken,
    },
    {
      provide: serviceTypeToSymbolMap[ServiceType.warrior],
      useClass: NestJsNinja,
    },
    {
      provide: serviceTypeToSymbolMap[ServiceType.weapon],
      useClass: NestJsKatana,
    },
  ],
})
class ContainerModule {}

export async function buildNestJsApplicationContext(): Promise<INestApplicationContext> {
  const nestJsApplicationContext: INestApplicationContext =
    await NestFactory.createApplicationContext(ContainerModule);

  return nestJsApplicationContext;
}
