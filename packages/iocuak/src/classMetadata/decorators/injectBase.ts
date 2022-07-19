import {
  ClassElementMetadata,
  ClassMetadata,
  getDefaultClassMetadata,
  MetadataKey,
  updateReflectMetadata,
} from '@cuaklabs/iocuak-reflect-metadata-utils';

export function injectBase<TInput>(
  input: TInput,
  inputToClassElementMetadata: (input: TInput) => ClassElementMetadata,
): ParameterDecorator & PropertyDecorator {
  const decorator: ParameterDecorator & PropertyDecorator = (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol, // It may be undefined!!
    parameterIndex?: number,
  ): void => {
    if (parameterIndex === undefined) {
      return injectProperty(input, inputToClassElementMetadata)(
        target,
        propertyKey,
      );
    } else {
      return injectParameter(input, inputToClassElementMetadata)(
        target,
        propertyKey,
        parameterIndex,
      );
    }
  };

  return decorator;
}

function injectParameter<TInput>(
  input: TInput,
  inputToClassElementMetadata: (input: TInput) => ClassElementMetadata,
): ParameterDecorator {
  return (
    // eslint-disable-next-line @typescript-eslint/ban-types
    target: Object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ): void => {
    if (isConstructorParameter(target, propertyKey)) {
      updateReflectMetadata(
        target,
        MetadataKey.inject,
        getDefaultClassMetadata(),
        (classMetadata: ClassMetadata): ClassMetadata => {
          classMetadata.constructorArguments[parameterIndex] =
            inputToClassElementMetadata(input);

          return classMetadata;
        },
      );
    } else {
      throw new Error(
        `Found an @inject decorator in a non constructor parameter.
Found @inject decorator at method "${
          propertyKey?.toString() ?? ''
        }" at class "${target.constructor.name}"`,
      );
    }
  };
}

function injectProperty<TInput>(
  input: TInput,
  inputToClassElementMetadata: (input: TInput) => ClassElementMetadata,
): PropertyDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (target: Object, propertyKey: string | symbol): void => {
    updateReflectMetadata(
      target.constructor,
      MetadataKey.inject,
      getDefaultClassMetadata(),
      (classMetadata: ClassMetadata): ClassMetadata => {
        classMetadata.properties.set(
          propertyKey,
          inputToClassElementMetadata(input),
        );

        return classMetadata;
      },
    );
  };
}

function isConstructorParameter(
  target: unknown,
  propertyKey: string | symbol | undefined,
): boolean {
  return typeof target === 'function' && propertyKey === undefined;
}
