// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export function getReflectMetadata<TMetadata>(
  target: object,
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
