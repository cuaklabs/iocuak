# Fixtures

Sometimes tests demands intances which are compliant with certain requirements. Those requirements are often shared between multiple modules. Those requirements often change. As developers we want fixture providers which can be easilly used in those scenarios.

The current solution is using fixture classes with static methods used as fixture builders.

## Fixture classes

A fixture class provides several methods used to build fixtures matching certain requirements. Consider the class `User`

```ts
export enum UserRole {
  commoner,
  lord,
}

export interface User {
  id: string;
  role: UserRole;
  username: string;
}

```

An `User` fixture class could be the following one:

```ts
import { User } from 'path/to/user';
import { User } from 'path/to/user/role';

export class UserFixtures {
  public static get any(): User {
    const fixture: User = {
      id: '6a920dea-cce7-4360-ab93-1dfe2b7477a2',
      role: UserRole.commoner,
      username: 'John Doe',
    };

    return fixture;
  }

  public static get withRoleCommoner(): User {
    const fixture: User = {
      ...UserFixtures.any,
      role: UserRole.commoner,
    };

    return fixture;
  }

  public static get withRoleLord(): User {
    const fixture: User = {
      ...UserFixtures.any,
      role: UserRole.lord,
    };

    return fixture;
  }

  public static get withUseCaseMeaningfulUseCaseNameEntityAlias(): User {
    const fixture: User = {
      // Build your user with the use case requirements
    };

    return fixture;
  }
}

```

The `any` fixture represents any user. It means if you want a user who should be a `commoner`, **do not** use the `any` fixture, use the `withRoleCommoner` one.

Fixture classes methods must follow a nomenclature convention:
- A fixture class method can be named `any`.
- A fixture class method can be named `with[propertyValueList]`, where `propertyValueList` is a string describing a sequence of property assignments:
  - `withRoleCommoner`
  - `withRoleLordAndUsernameSophie`
- A fixture class method can be named `withUseCase[meaningfulUseCaseName][entityAlias]`, where `meaningfulUseCaseName` is a use case name such as `PostUserApiV3_001`. Any use case must be documented and maintained, so generating use cases is a worst case scenario to be avoided if possible.
