# Decorating classes

It's required to provide metadata to the IoC container in order to create instances.

## The `injectable` decorator

This decorator targets a class and allows to provide metadata about it.

First of all, let's talk about metadata we may provide:

- Scope: when the container creates an instance, it may reuse an existing instance instead if its scope allows it. These are the current scopes of a binding:
  - Transient: An instance of this service is never reused.
  - Request: An instance of this service is reused if service is requested under the same `ContainerApi.get` request.

    **Example**: Given the services `A`, `B` and `C`, both `A` and `B` services depends on `C`. In addition, `A` services depends on `B`. If `C` is injected on request scope, a request to the `A` service results in the same `C` instance being injected to both `A` and `B` services.

  - Singleton: An instance of this service is allways reused.

```ts
import { injectable, TaskScope } from '@cuaklabs/iocuak';

/**
 * Foo is injectable on transient scope and its service id is the type Foo itself
 */
@injectable()
class Foo {}

const barSymbol: symbol = Symbol();

/** 
 * Bar is injectable on singleton scope. Its service id is the barSymbol symbol
 */
@injectable({
  id: barSymbol,
  scope: TaskScope.singleton,
})
class Bar {}

```

## The `inject` decorator

This decorator targets a property or a parameter and provides the service id associated to that property or parameter.

```ts
import { inject } from '@cuaklabs/iocuak';

import { dummyFooServiceId } from 'some/path';

class Dummy {
  @inject(dummyFooServiceId)
  public foo: unknown;
}

```

This way the IoC container knows the property `foo` should be injected with the service associated to `dummyFooServiceId`.
