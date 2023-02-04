import {
  ContainerModuleMetadataId,
  ServiceId,
  stringifyServiceId,
} from '@cuaklabs/iocuak-common';
import {
  ClassElementMetadataApi,
  ClassElementMetadataApiType,
} from '@cuaklabs/iocuak-models-api';

import { isClassElementMetadataApi } from '../../../classMetadata/utils/api/isClassElementMetadataApi';
import { hashString } from '../../../foundation/calculations/hashString';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';

export function buildContainerModuleFactoryMetadataId<TArgs extends unknown[]>(
  metadata: ContainerModuleFactoryMetadataApi<TArgs>,
): ContainerModuleMetadataId {
  let metadataId: ContainerModuleMetadataId;

  if (metadata.id === undefined) {
    const stringifiedMetadata: string = `${stringifyInjects(
      metadata.injects,
    )}|${metadata.factory.toString()}`;

    metadataId = hashString(stringifiedMetadata);
  } else {
    metadataId = metadata.id;
  }

  return metadataId;
}

function stringifyInjects(
  injects: (ServiceId | ClassElementMetadataApi)[] | undefined,
): string {
  return injects?.map(stringifyInject).join(',') ?? '';
}

function stringifyInject(inject: ServiceId | ClassElementMetadataApi): string {
  let stringifiedInject: string;

  if (isClassElementMetadataApi(inject)) {
    stringifiedInject = `${inject.type}|`;
    switch (inject.type) {
      case ClassElementMetadataApiType.serviceId:
        stringifiedInject += stringifyServiceId(inject.value);
        break;
      case ClassElementMetadataApiType.tag:
        stringifiedInject += inject.value.toString();
        break;
    }
  } else {
    stringifiedInject = stringifyServiceId(inject);
  }

  return stringifiedInject;
}
