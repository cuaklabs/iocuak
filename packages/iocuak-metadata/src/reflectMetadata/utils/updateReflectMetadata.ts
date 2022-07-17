import { getReflectMetadata } from './getReflectMetadata';

export function updateReflectMetadata<TMetadata>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Object,
  metadataKey: unknown,
  defaultValue: TMetadata,
  callback: (metadata: TMetadata) => TMetadata,
): void {
  const metadata: TMetadata =
    getReflectMetadata(target, metadataKey) ?? defaultValue;

  const updatedMetadata: TMetadata = callback(metadata);

  Reflect.defineMetadata(metadataKey, updatedMetadata, target);
}
