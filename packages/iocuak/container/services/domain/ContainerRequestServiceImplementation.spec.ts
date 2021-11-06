import { ServiceId } from '../../../common/models/domain/ServiceId';
import { ContainerRequestServiceImplementation } from './ContainerRequestServiceImplementation';

describe(ContainerRequestServiceImplementation.name, () => {
  describe('.end()', () => {
    describe('when called, and no entry has requestId symbol', () => {
      let result: unknown;

      beforeAll(() => {
        const requestIdFixture: symbol = Symbol();

        const containerRequestServiceImplementation: ContainerRequestServiceImplementation =
          new ContainerRequestServiceImplementation();

        try {
          containerRequestServiceImplementation.end(requestIdFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message:
              'Error trying to end request. No request with the id provided was found',
          }),
        );
      });
    });

    describe('when called, and an entry has requestId symbol', () => {
      let result: unknown;

      beforeAll(() => {
        const containerRequestServiceImplementation: ContainerRequestServiceImplementation =
          new ContainerRequestServiceImplementation();

        try {
          const requestIdFixture: symbol =
            containerRequestServiceImplementation.start();

          containerRequestServiceImplementation.end(requestIdFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should not throw an Error', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('.get()', () => {
    describe('when called, and no entry has requestId symbol', () => {
      let result: unknown;

      beforeAll(() => {
        const requestIdFixture: symbol = Symbol();
        const serviceIdFixture: ServiceId = 'sample-service-id';

        const containerRequestServiceImplementation: ContainerRequestServiceImplementation =
          new ContainerRequestServiceImplementation();

        try {
          containerRequestServiceImplementation.get(
            requestIdFixture,
            serviceIdFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message:
              'Error trying to get service. No request with the id provided was found',
          }),
        );
      });
    });

    describe('when called, and an entry has requestId symbol with no serviceId', () => {
      let result: unknown;

      beforeAll(() => {
        const requestIdFixture: symbol = Symbol();
        const serviceIdFixture: ServiceId = 'sample-service-id';

        const containerRequestServiceImplementation: ContainerRequestServiceImplementation =
          new ContainerRequestServiceImplementation();

        try {
          containerRequestServiceImplementation.get(
            requestIdFixture,
            serviceIdFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message:
              'Error trying to get service. No request with the id provided was found',
          }),
        );
      });
    });

    describe('when called, and an entry has requestId symbol with serviceId', () => {
      let serviceFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        const serviceIdFixture: ServiceId = 'sample-service-id';
        serviceFixture = {
          foo: 'bar',
        };

        const containerRequestServiceImplementation: ContainerRequestServiceImplementation =
          new ContainerRequestServiceImplementation();

        const requestIdFixture: symbol =
          containerRequestServiceImplementation.start();

        containerRequestServiceImplementation.set(
          requestIdFixture,
          serviceIdFixture,
          serviceFixture,
        );

        result = containerRequestServiceImplementation.get(
          requestIdFixture,
          serviceIdFixture,
        );
      });

      it('should return a service', () => {
        expect(result).toBe(serviceFixture);
      });
    });
  });

  describe('.set()', () => {
    describe('when called, and no entry has requestId symbol', () => {
      let result: unknown;

      beforeAll(() => {
        const requestIdFixture: symbol = Symbol();
        const serviceIdFixture: ServiceId = 'sample-service-id';
        const serviceFixture: unknown = {
          foo: 'bar',
        };

        const containerRequestServiceImplementation: ContainerRequestServiceImplementation =
          new ContainerRequestServiceImplementation();

        try {
          containerRequestServiceImplementation.set(
            requestIdFixture,
            serviceIdFixture,
            serviceFixture,
          );
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message:
              'Error trying to get service. No request with the id provided was found',
          }),
        );
      });
    });

    describe('when called, and an entry has requestId symbol with no serviceId', () => {
      let containerRequestServiceImplementation: ContainerRequestServiceImplementation;
      let requestIdFixture: symbol;
      let serviceIdFixture: ServiceId;
      let serviceFixture: unknown;

      beforeAll(() => {
        serviceIdFixture = 'sample-service-id';
        serviceFixture = {
          foo: 'bar',
        };

        containerRequestServiceImplementation =
          new ContainerRequestServiceImplementation();

        requestIdFixture = containerRequestServiceImplementation.start();

        containerRequestServiceImplementation.set(
          requestIdFixture,
          serviceIdFixture,
          serviceFixture,
        );
      });

      describe('when called .get()', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerRequestServiceImplementation.get(
            requestIdFixture,
            serviceIdFixture,
          );
        });

        it('should return a service', () => {
          expect(result).toBe(serviceFixture);
        });
      });
    });

    describe('when called, and an entry has requestId symbol with serviceId', () => {
      let containerRequestServiceImplementation: ContainerRequestServiceImplementation;
      let requestIdFixture: symbol;
      let serviceIdFixture: ServiceId;
      let serviceFixture: unknown;

      beforeAll(() => {
        serviceIdFixture = 'sample-service-id';
        const oldServiceFixture: unknown = {
          foo: 'bar',
        };
        serviceFixture = {
          foo: 'baz',
        };

        containerRequestServiceImplementation =
          new ContainerRequestServiceImplementation();

        requestIdFixture = containerRequestServiceImplementation.start();

        containerRequestServiceImplementation.set(
          requestIdFixture,
          serviceIdFixture,
          oldServiceFixture,
        );

        containerRequestServiceImplementation.set(
          requestIdFixture,
          serviceIdFixture,
          serviceFixture,
        );
      });

      describe('when called .get()', () => {
        let result: unknown;

        beforeAll(() => {
          result = containerRequestServiceImplementation.get(
            requestIdFixture,
            serviceIdFixture,
          );
        });

        it('should return a service', () => {
          expect(result).toBe(serviceFixture);
        });
      });
    });
  });

  describe('.start()', () => {
    describe('when called', () => {
      let containerRequestServiceImplementation: ContainerRequestServiceImplementation;
      let startResult: unknown;

      beforeAll(() => {
        containerRequestServiceImplementation =
          new ContainerRequestServiceImplementation();

        startResult = containerRequestServiceImplementation.start();
      });

      it('should return a symbol', () => {
        expect(startResult).toStrictEqual(expect.any(Symbol));
      });

      describe('when called .end()', () => {
        let endResult: unknown;

        beforeAll(() => {
          try {
            containerRequestServiceImplementation.end(startResult as symbol);
          } catch (error: unknown) {
            endResult = error;
          }
        });

        it('should not throw an error', () => {
          expect(endResult).toBeUndefined();
        });
      });
    });
  });
});
