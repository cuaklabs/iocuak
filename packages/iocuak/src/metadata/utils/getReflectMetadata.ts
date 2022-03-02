export function getReflectMetadata<TMetadata>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  target: Object,
  metadataKey: unknown,
): TMetadata | undefined {
  let metadata: TMetadata | undefined;

  if (Reflect.hasOwnMetadata(metadataKey, target)) {
    metadata = Reflect.getMetadata(metadataKey, target) as TMetadata;
  } else {
    metadata = undefined;
  }

  return metadata;
}
