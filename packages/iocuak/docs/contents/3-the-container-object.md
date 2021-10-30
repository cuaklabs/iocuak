# The container object

The core of this library is the IoC container. It allows you to bind services and create instances based on those bindings.

## Binding a service

Services can be easily bound to the container calling it directly.

```ts
import { ContainerApi } from '@cuaklabs/iocuak';

class Dummy {}

const containerApi: ContainerApi = new ContainerApi();
containerApi.bind(Dummy);

```

Services can also be bound through a `ContainerModuleApi`:

```ts
const containerModuleApi: ContainerModuleApi = {
  load: (container: ContainerApiService): void => {
      container.bind(Dummy);
  },
};

container.load(containerModuleApi);
```

## Creating instances

Once a service and all its dependencies are bound, its possible to create an instance if all the classes involved are properly decorated

```ts
import { ContainerApi, injectable } from '@cuaklabs/iocuak';

@injectable()
class Dummy {}

const containerApi: ContainerApi = new ContainerApi();
containerApi.bind(Dummy);

const dummyInstance: Dummy = containerApi.get(Dummy);
```
