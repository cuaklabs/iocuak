import { ContainerModuleMetadataId, isFunction } from '@cuaklabs/iocuak-common';
import {
  ContainerModuleClassMetadata,
  ContainerModuleFactoryMetadata,
  ContainerModuleMetadata,
  ContainerModuleMetadataBase,
  ContainerModuleMetadataType,
} from '@cuaklabs/iocuak-core';

import { isContainerModuleApi } from '../../../containerModule/utils/api/isContainerModuleApi';
import { ContainerModuleClassMetadataApi } from '../../models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from '../../models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleMetadataApi } from '../../models/api/ContainerModuleMetadataApi';
import { ContainerModuleMetadataBaseApi } from '../../models/api/ContainerModuleMetadataBaseApi';
import { buildContainerModuleClassMetadata } from './buildContainerModuleClassMetadata';
import { buildContainerModuleFactoryMetadata } from './buildContainerModuleFactoryMetadata';
import { isContainerModuleClassMetadataApi } from './isContainerModuleClassMetadataApi';

export function buildContainerModuleMetadataArray<TArgs extends unknown[]>(
  containerModuleMetadataApi: ContainerModuleMetadataApi<TArgs>,
): ContainerModuleMetadata<TArgs>[] {
  const containerModuleMetadataArray: ContainerModuleMetadata<TArgs>[] = [];

  appendContainerModuleMetadataAndNested(
    containerModuleMetadataApi,
    containerModuleMetadataArray,
  );

  return containerModuleMetadataArray;
}

function appendContainerModuleMetadataAndNested<TArgs extends unknown[]>(
  containerModuleMetadataApi: ContainerModuleMetadataApi<TArgs>,
  containerModuleMetadataArray: ContainerModuleMetadata<TArgs>[],
): ContainerModuleMetadata<TArgs> {
  let containerModuleMetadata: ContainerModuleMetadata<TArgs>;

  if (isFunction(containerModuleMetadataApi)) {
    containerModuleMetadata = appendContainerModuleClassMetadataAndNested(
      {
        module: containerModuleMetadataApi,
      },
      containerModuleMetadataArray,
    );
  } else {
    if (isContainerModuleApi(containerModuleMetadataApi)) {
      containerModuleMetadata = appendContainerModuleFactoryMetadataAndNested(
        {
          factory: () => containerModuleMetadataApi,
        },
        containerModuleMetadataArray,
      );
    } else {
      if (isContainerModuleClassMetadataApi(containerModuleMetadataApi)) {
        containerModuleMetadata = appendContainerModuleClassMetadataAndNested(
          containerModuleMetadataApi,
          containerModuleMetadataArray,
        );
      } else {
        containerModuleMetadata = appendContainerModuleFactoryMetadataAndNested(
          containerModuleMetadataApi,
          containerModuleMetadataArray,
        );
      }
    }
  }

  return containerModuleMetadata;
}

function appendContainerModuleMetadataBaseAndNested<
  TArgs extends unknown[],
  TType extends ContainerModuleMetadataType,
  TMetadata extends ContainerModuleMetadataBase<TType> &
    ContainerModuleMetadata<TArgs>,
  TMetadataApi extends ContainerModuleMetadataBaseApi,
>(
  buildMetadata: (
    metatadataApi: TMetadataApi,
    required: ContainerModuleMetadataId[],
  ) => TMetadata,
  containerModuleMetadataApi: TMetadataApi,
  containerModuleMetadataArray: ContainerModuleMetadata<TArgs>[],
): TMetadata {
  const nestedContainerModuleMetadataArray: ContainerModuleMetadata<TArgs>[] =
    appendContainerModuleMetadataImports(
      containerModuleMetadataApi,
      containerModuleMetadataArray,
    );

  const containerModuleMetadataRequiredIds: ContainerModuleMetadataId[] =
    nestedContainerModuleMetadataArray.map(
      (
        nestedContainerModuleMetadata: ContainerModuleMetadata<TArgs>,
      ): ContainerModuleMetadataId => nestedContainerModuleMetadata.id,
    );

  const containerModuleMetadata: TMetadata = buildMetadata(
    containerModuleMetadataApi,
    containerModuleMetadataRequiredIds,
  );

  containerModuleMetadataArray.push(containerModuleMetadata);

  return containerModuleMetadata;
}

const appendContainerModuleClassMetadataAndNested: <TArgs extends unknown[]>(
  containerModuleClassMetadataApi: ContainerModuleClassMetadataApi,
  containerModuleMetadataArray: ContainerModuleMetadata<TArgs>[],
) => ContainerModuleClassMetadata = <TArgs extends unknown[]>(
  containerModuleClassMetadataApi: ContainerModuleClassMetadataApi,
  containerModuleMetadataArray: ContainerModuleMetadata<TArgs>[],
): ContainerModuleClassMetadata =>
  appendContainerModuleMetadataBaseAndNested(
    buildContainerModuleClassMetadata,
    containerModuleClassMetadataApi,
    containerModuleMetadataArray,
  );

const appendContainerModuleFactoryMetadataAndNested: <TArgs extends unknown[]>(
  containerModuleFactoryMetadataApi: ContainerModuleFactoryMetadataApi<TArgs>,
  containerModuleMetadataArray: ContainerModuleMetadata<TArgs>[],
) => ContainerModuleFactoryMetadata<TArgs> = <TArgs extends unknown[]>(
  containerModuleFactoryMetadataApi: ContainerModuleFactoryMetadataApi<TArgs>,
  containerModuleMetadataArray: ContainerModuleMetadata<TArgs>[],
): ContainerModuleFactoryMetadata<TArgs> =>
  appendContainerModuleMetadataBaseAndNested(
    buildContainerModuleFactoryMetadata,
    containerModuleFactoryMetadataApi,
    containerModuleMetadataArray,
  );

function appendContainerModuleMetadataImports<TArgs extends unknown[]>(
  containerModuleMetadataApi: ContainerModuleMetadataBaseApi,
  containerModuleMetadataArray: ContainerModuleMetadata<TArgs>[],
): ContainerModuleMetadata<TArgs>[] {
  const containerModuleMetadataApiImports: ContainerModuleMetadataApi<TArgs>[] =
    containerModuleMetadataApi.imports ?? [];

  return containerModuleMetadataApiImports.map(
    (containerModuleMetadataApiImport: ContainerModuleMetadataApi<TArgs>) =>
      appendContainerModuleMetadataAndNested(
        containerModuleMetadataApiImport,
        containerModuleMetadataArray,
      ),
  );
}
