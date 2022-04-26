Feature: Create instance

  Containers are able to create services whenever the service and all its dependencies are bound

  Background: Having a container
  Given a container

  Rule: Any bound type service is instantiated

    Scenario: Bound value service request
      Given a "value service"
      When the value service is bound
      And an instace of the value service is requested
      Then an instance from the value service is returned

    Scenario Outline: Bound type service with bound dependencies request
      Given a <type_service>
      When the type service dependencies are bound
      And the type service is bound
      And an instace of the type service is requested
      Then an instance from the type service is returned
      And the instance from the type service was constructed with the right parameters
      And the instance from the type service has the right properties

      Examples:
        | type_service                                        |
        | "type service with no dependencies"                 |
        | "type service with binding with request scope"      |
        | "type service with binding with singleton scope"    |
        | "type service with binding with transient scope"    |
        | "type service with constructor parameters"          |
        | "type service with properties"                      |

    Scenario Outline: Bound type service with unbound class type service dependencies request
      Given a <type_service>
      When the type service dependencies are bound
      And the type service is bound
      And an instace of the type service is requested
      Then an instance from the type service is returned
      And the instance from the type service was constructed with the right parameters
      And the instance from the type service has the right properties

      Examples:
        | type_service                                                             |
        | "type service with unbound class type service constructor parameters"    |
        | "type service with unbound class type service properties"                |

  Rule: Any unbound class type service is instantiated

    Scenario: Unbound class type service request
      Given a "type service with type service id"
      When the type service dependencies are bound
      And an instace of the type service is requested
      Then an instance from the type service is returned
      And the instance from the type service was constructed with the right parameters
      And the instance from the type service has the right properties

  Rule: Given a type service, any two service instances from different requests are the same if and only if the service is bound on singleton scope

    Scenario Outline: Bound type service request
      Given a "type service with binding with <scope> scope"
      When the type service dependencies are bound
      And the type service is bound
      And an instace of the type service is requested
      And a second instace of the type service is requested
      Then both first and second instances <comparison> the same one

      Examples:
        | scope     | comparison |
        | request   | are not    |
        | singleton | are        |
        | transient | are not    |

  Rule: Given a type service, any two service instances from the same request are not the same if and only if the service is bound on transient scope

    Scenario Outline: Bound type service with the same dependency type service request
      Given a "type service with two dependencies of the same type with <scope> scope"
      When the type service dependencies are bound
      And the type service is bound
      And an instace of the type service is requested
      Then every type dependency constructor is the same one and has been caled <times> times

    Examples:
      | scope     | times |
      | request   | 1     |
      | singleton | 1     |
      | transient | 2     |