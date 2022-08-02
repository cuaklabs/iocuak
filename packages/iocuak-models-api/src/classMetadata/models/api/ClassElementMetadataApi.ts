import { ClassElementServiceIdMetadataApi } from './ClassElementServiceIdMetadataApi';
import { ClassElementTagMetadataApi } from './ClassElementTagMetadataApi';

export type ClassElementMetadataApi =
  | ClassElementServiceIdMetadataApi
  | ClassElementTagMetadataApi;
