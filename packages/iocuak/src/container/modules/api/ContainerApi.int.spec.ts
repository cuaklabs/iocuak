import 'reflect-metadata';

import { inject } from '../../../classMetadata/decorators/inject';
import { Newable } from '../../../common/models/domain/Newable';
import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerModuleMetadataApi } from '../../../containerModuleMetadata/models/api/ContainerModuleMetadataApi';
import { injectable } from '../../../metadata/decorators/injectable';
import { ContainerModuleBindingServiceApi } from '../../services/api/ContainerModuleBindingServiceApi';
import { ContainerApi } from './ContainerApi';

describe(ContainerApi.name, () => {
  describe('.bind', () => {
    describe('having a type with no metadata', () => {
      let typeFixture: Newable;

      beforeAll(() => {
        typeFixture = class {};
      });

      describe('when called', () => {
        let containerApi: ContainerApi;

        let result: unknown;

        beforeAll(() => {
          containerApi = ContainerApi.build();

          try {
            containerApi.bind(typeFixture);
          } catch (error: unknown) {
            result = error;
          }
        });

        it('should throw an Error', () => {
          expect(result).toBeInstanceOf(Error);
        });
      });
    });

    describe('having a type with binding metadata and no constructor metadata nor properties metadata', () => {
      let typeFixture: Newable;

      beforeAll(() => {
        @injectable()
        class TypeFixture {
          public property!: string;

          constructor(public readonly parameter: string) {}
        }

        typeFixture = TypeFixture;
      });

      describe('when called', () => {
        let containerApi: ContainerApi;

        beforeAll(() => {
          containerApi = ContainerApi.build();

          containerApi.bind(typeFixture);
        });

        describe('when called .get()', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(typeFixture);
          });

          it('should return an instance with no properties set', () => {
            expect(result).toBeInstanceOf(typeFixture);
            expect(result).not.toHaveProperty('property');
          });
        });
      });
    });

    describe('having a type with binding metadata and constructor metadata and no properties metadata', () => {
      let parameterServiceIdFixture: ServiceId;
      let typeFixture: Newable;

      beforeAll(() => {
        parameterServiceIdFixture = 'sample-service';

        @injectable()
        class TypeFixture {
          public property: string | undefined;

          constructor(
            @inject(parameterServiceIdFixture)
            public readonly parameter: unknown,
          ) {}
        }

        typeFixture = TypeFixture;
      });

      describe('when called', () => {
        let containerApi: ContainerApi;

        beforeAll(() => {
          containerApi = ContainerApi.build();

          containerApi.bind(typeFixture);
        });

        describe('when called .bind() with dependent service', () => {
          let dependentTypeFixture: Newable;

          beforeAll(() => {
            @injectable({
              id: parameterServiceIdFixture,
            })
            class DependentTypeFixture {}

            dependentTypeFixture = DependentTypeFixture;

            containerApi.bind(dependentTypeFixture);
          });

          describe('when called .get()', () => {
            let result: unknown;

            beforeAll(() => {
              result = containerApi.get(typeFixture);
            });

            it('should return an instance', () => {
              expect(result).toStrictEqual(
                new typeFixture(new dependentTypeFixture()),
              );
            });
          });
        });

        describe('when called .get()', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(typeFixture);
          });

          it('should return an instance', () => {
            expect(result).toBeInstanceOf(typeFixture);
          });
        });
      });
    });

    describe('having a type with binding metadata and constructor metadata and properties metadata', () => {
      let parameterServiceIdFixture: ServiceId;
      let propertyServiceIdFixture: ServiceId;
      let typeFixture: Newable;

      beforeAll(() => {
        parameterServiceIdFixture = 'sample-parameter-service';
        propertyServiceIdFixture = 'sample-property-service';

        @injectable()
        class TypeFixture {
          @inject(propertyServiceIdFixture)
          public property: unknown;

          constructor(
            @inject(parameterServiceIdFixture)
            public readonly parameter: unknown,
          ) {}
        }

        typeFixture = TypeFixture;
      });

      describe('when called', () => {
        let containerApi: ContainerApi;

        beforeAll(() => {
          containerApi = ContainerApi.build();

          containerApi.bind(typeFixture);
        });

        describe('when called .bind() on type dependencies', () => {
          let parameterTypeFixture: Newable;
          let propertyTypeFixture: Newable;

          beforeAll(() => {
            @injectable({
              id: parameterServiceIdFixture,
            })
            class ParameterTypeFixture {}

            @injectable({
              id: propertyServiceIdFixture,
            })
            class PropertyTypeFixture {}

            parameterTypeFixture = ParameterTypeFixture;
            propertyTypeFixture = PropertyTypeFixture;

            containerApi.bind(parameterTypeFixture);
            containerApi.bind(propertyTypeFixture);
          });

          describe('when called .get()', () => {
            let result: unknown;

            beforeAll(() => {
              result = containerApi.get(typeFixture);
            });

            it('should return an instance', () => {
              const expected: unknown = new typeFixture(
                new parameterTypeFixture(),
              );

              (expected as Record<string, unknown>)['property'] =
                new propertyTypeFixture();

              expect(result).toStrictEqual(expected);
            });
          });
        });
      });
    });
  });

  describe('.bindToValue', () => {
    describe('when called', () => {
      let serviceIdFixture: ServiceId;
      let valueFixture: unknown;

      let containerApi: ContainerApi;

      beforeAll(() => {
        serviceIdFixture = 'service-id';
        valueFixture = {
          foo: 'bar',
        };

        containerApi = ContainerApi.build();

        containerApi.bindToValue(serviceIdFixture, valueFixture);
      });

      describe('when called .get()', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerApi.get(serviceIdFixture);
        });

        it('should return the value binded', () => {
          expect(result).toBe(valueFixture);
        });
      });
    });
  });

  describe('.createChild', () => {
    describe('when called .bind()', () => {
      let containerApi: ContainerApi;
      let typeFixture: Newable;

      beforeAll(() => {
        @injectable({})
        class TypeFixture {}

        typeFixture = TypeFixture;

        containerApi = ContainerApi.build();

        containerApi.bind(typeFixture);
      });

      describe('when called', () => {
        let childContainerApi: ContainerApi;

        beforeAll(() => {
          childContainerApi = containerApi.createChild();
        });

        describe('when called child.get() and parent has the binding', () => {
          let result: unknown;

          beforeAll(() => {
            result = childContainerApi.get(typeFixture);
          });

          it('should return an instance', () => {
            expect(result).toBeInstanceOf(typeFixture);
          });
        });
      });
    });
  });

  describe('.get', () => {
    describe('having a newable serviceId', () => {
      let serviceIdFixture: Newable;

      beforeAll(() => {
        @injectable()
        class Foo {}

        serviceIdFixture = Foo;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          const containerApi: ContainerApi = ContainerApi.build();

          result = containerApi.get(serviceIdFixture);
        });

        it('should return an instance', () => {
          expect(result).toBeInstanceOf(serviceIdFixture);
          expect(result).toStrictEqual(new serviceIdFixture());
        });
      });
    });

    describe('having a newable serviceId with binding metadata and constructor type metadata and properties type metadata', () => {
      @injectable()
      class ParameterTypeFixture {}

      @injectable()
      class PropertyTypeFixture {}

      @injectable()
      class TypeFixture {
        @inject(PropertyTypeFixture)
        public property: unknown;

        constructor(
          @inject(ParameterTypeFixture)
          public readonly parameter: unknown,
        ) {}
      }

      let serviceIdFixture: Newable<TypeFixture, [unknown]>;

      beforeAll(() => {
        serviceIdFixture = TypeFixture;
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          const containerApi: ContainerApi = ContainerApi.build();

          result = containerApi.get(serviceIdFixture);
        });

        it('should return an instance', () => {
          const expected: TypeFixture = new TypeFixture(
            new ParameterTypeFixture(),
          );
          expected.property = new PropertyTypeFixture();

          expect(result).toStrictEqual(expected);
        });
      });
    });
  });

  describe('.loadMetadata', () => {
    let containerApi: ContainerApi;

    beforeAll(() => {
      containerApi = ContainerApi.build();
    });

    describe('having container module metadata with dependencies and injections', () => {
      let serviceIdFixture: ServiceId;
      let dependentServiceIdFixture: ServiceId;
      let valueFixture: unknown;

      let containerModuleMetadataApi: ContainerModuleMetadataApi<[unknown]>;

      beforeAll(() => {
        serviceIdFixture = 'service';
        dependentServiceIdFixture = 'dependent-service';
        valueFixture = 'bar';

        containerModuleMetadataApi = {
          factory: (value: unknown) => ({
            load: (
              containerModuleBindingService: ContainerModuleBindingServiceApi,
            ) => {
              containerModuleBindingService.bindToValue(
                serviceIdFixture,
                value,
              );
            },
          }),
          imports: [
            {
              factory: () => ({
                load: (
                  containerModuleBindingService: ContainerModuleBindingServiceApi,
                ) => {
                  containerModuleBindingService.bindToValue(
                    dependentServiceIdFixture,
                    valueFixture,
                  );
                },
              }),
              imports: [],
              injects: [],
            },
          ],
          injects: [dependentServiceIdFixture],
        };
      });

      describe('when called', () => {
        beforeAll(async () => {
          await containerApi.loadMetadata(containerModuleMetadataApi);
        });

        describe('when called .get() with a bound service id', () => {
          let result: unknown;

          beforeAll(() => {
            result = containerApi.get(serviceIdFixture);
          });

          it('should return the bound service', () => {
            expect(result).toBe(valueFixture);
          });
        });
      });
    });
  });
});
