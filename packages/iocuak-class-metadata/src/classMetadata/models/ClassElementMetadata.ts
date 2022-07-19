import { ClassElementServiceIdMetadata } from './ClassElementServiceIdMetadata';
import { ClassElementTagMetadata } from './ClassElementTagMetadata';

export type ClassElementMetadata =
  | ClassElementServiceIdMetadata
  | ClassElementTagMetadata;
