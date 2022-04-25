Feature: Create instance

  Containers are able to create services whenever the service and all its dependencies are bound

  Rule: Any bound type service is instantiated

    Background: Having a container
    Given a container

  Scenario: A bound value service is instantiated
    Given a "value service"
    When the value service is bound
    And an instace of the value service is requested
    Then an instance from the value service is returned

  Scenario Outline: A bound type service is instantiated
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
