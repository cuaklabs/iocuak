import {
  ClassElementMetadata,
  ClassMetadata,
  classMetadataReflectKey,
  getDefaultClassMetadata,
} from '@cuaklabs/iocuak-models';
import { updateReflectMetadata } from '@cuaklabs/iocuak-reflect-metadata-utils';

import { ParameterDecorator } from '../../common/models/ParameterDecorator';
import { ParameterOrPropertyDecorator } from '../../common/models/ParameterOrPropertyDecorator';

export function injectBase<TInput>(
  input: TInput,
  inputToClassElementMetadata: (input: TInput) => ClassElementMetadata,
): ParameterOrPropertyDecorator {
  const decorator: ParameterOrPropertyDecorator = (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex?: number,
  ): void => {
    if (parameterIndex === undefined) {
      injectProperty(input, inputToClassElementMetadata)(
        target,
        propertyKey as string | symbol,
      );
      return;
    } else {
      injectParameter(input, inputToClassElementMetadata)(
        target,
        propertyKey,
        parameterIndex,
      );
      return;
    }
  };

  return decorator;
}

function injectParameter<TInput>(
  input: TInput,
  inputToClassElementMetadata: (input: TInput) => ClassElementMetadata,
): ParameterDecorator {
  return (
    target: object,
    propertyKey: string | symbol | undefined,
    parameterIndex: number,
  ): void => {
    if (isConstructorParameter(target, propertyKey)) {
      updateReflectMetadata(
        target,
        classMetadataReflectKey,
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
  return (target: object, propertyKey: string | symbol): void => {
    updateReflectMetadata(
      target.constructor,
      classMetadataReflectKey,
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
