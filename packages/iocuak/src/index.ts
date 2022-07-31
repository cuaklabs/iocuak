import { Newable, ServiceId, Tag } from '@cuaklabs/iocuak-common';
import {
  inject,
  injectable,
  injectFrom,
  injectFromBase,
  injectTag,
} from '@cuaklabs/iocuak-decorators';

import { BaseBindingApi } from './binding/models/api/BaseBindingApi';
import { BindingApi } from './binding/models/api/BindingApi';
import { BindingScopeApi } from './binding/models/api/BindingScopeApi';
import { BindingTypeApi } from './binding/models/api/BindingTypeApi';
import { InjectableOptionsApi } from './binding/models/api/InjectableOptionsApi';
import { TypeBindingApi } from './binding/models/api/TypeBindingApi';
import { ValueBindingApi } from './binding/models/api/ValueBindingApi';
import { BindingServiceApi } from './binding/services/api/BindingServiceApi';
import { BaseClassElementMetadataApi } from './classMetadata/models/api/BaseClassElementMetadataApi';
import { BaseClassMetadataExtensionApi } from './classMetadata/models/api/BaseClassMetadataExtensionApi';
import { ClassElementMetadataApi } from './classMetadata/models/api/ClassElementMetadataApi';
import { ClassElementMetadataApiType } from './classMetadata/models/api/ClassElementMetadatApiType';
import { ClassElementServiceIdMetadataApi } from './classMetadata/models/api/ClassElementServiceIdMetadataApi';
import { ClassElementTagMetadataApi } from './classMetadata/models/api/ClassElementTagMetadataApi';
import { ClassMetadataApi } from './classMetadata/models/api/ClassMetadataApi';
import { ClassMetadataExtensionApi } from './classMetadata/models/api/ClassMetadataExtensionApi';
import { BindValueOptionsApi } from './container/models/api/BindValueOptionsApi';
import { ContainerApi } from './container/modules/api/ContainerApi';
import { ContainerInstanceServiceApi } from './container/services/api/ContainerInstanceServiceApi';
import { ContainerModuleBindingServiceApi } from './container/services/api/ContainerModuleBindingServiceApi';
import { ContainerModuleServiceApi } from './container/services/api/ContainerModuleServiceApi';
import { ContainerServiceApi } from './container/services/api/ContainerServiceApi';
import { ContainerModuleApi } from './containerModule/models/api/ContainerModuleApi';
import { ContainerModuleClassMetadataApi } from './containerModuleMetadata/models/api/ContainerModuleClassMetadataApi';
import { ContainerModuleFactoryMetadataApi } from './containerModuleMetadata/models/api/ContainerModuleFactoryMetadataApi';
import { ContainerModuleMetadataApi } from './containerModuleMetadata/models/api/ContainerModuleMetadataApi';
import { ContainerModuleMetadataBaseApi } from './containerModuleMetadata/models/api/ContainerModuleMetadataBaseApi';
import { MetadataProviderApi } from './metadata/modules/api/MetadataProviderApi';
import { MetadataServiceApi } from './metadata/services/api/MetadataServiceApi';

export type {
  BaseBindingApi as BaseBinding,
  BaseClassElementMetadataApi as BaseClassElementMetadata,
  BaseClassMetadataExtensionApi as BaseClassMetadataExtension,
  BindingApi as Binding,
  BindingServiceApi as BindingService,
  Tag,
  BindValueOptionsApi as BindValueOptions,
  ClassElementMetadataApi as ClassElementMetadata,
  ClassElementServiceIdMetadataApi as ClassElementServiceIdMetadata,
  ClassElementTagMetadataApi as ClassElementTagMetadata,
  ClassMetadataApi as ClassMetadata,
  ClassMetadataExtensionApi as ClassMetadataExtension,
  ContainerInstanceServiceApi as ContainerInstanceService,
  ContainerModuleApi as ContainerModule,
  ContainerModuleBindingServiceApi as ContainerModuleBindingService,
  ContainerModuleClassMetadataApi as ContainerModuleClassMetadata,
  ContainerModuleFactoryMetadataApi as ContainerModuleFactoryMetadata,
  ContainerModuleMetadataApi as ContainerModuleMetadata,
  ContainerModuleMetadataBaseApi as ContainerModuleMetadataBase,
  ContainerModuleServiceApi as ContainerModuleService,
  ContainerServiceApi as ContainerService,
  InjectableOptionsApi as InjectableOptions,
  MetadataServiceApi as MetadataService,
  Newable,
  TypeBindingApi as TypeBinding,
  ServiceId,
  ValueBindingApi as ValueBinding,
};

export {
  BindingScopeApi as BindingScope,
  BindingTypeApi as BindingType,
  ClassElementMetadataApiType as ClassElementMetadataType,
  ContainerApi as Container,
  inject,
  injectable,
  injectFrom,
  injectFromBase,
  injectTag,
  MetadataProviderApi as MetadataProvider,
};

export const a: number = 3;
