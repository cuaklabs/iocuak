Feature: Create instance

  Containers are able to create services whenever the service and all its dependencies are bound

  Rule: Any bound type service is instantiated

    Background: Having a container
    Given a container

  Scenario Outline: A bound type service with no dependencies is instantiated
    Given a <type_service>
    When the type service is bound
    And an instace of the type service is requested
    Then an instance from the type service is returned

    Examples:
        | type_service                                        |
        | "type service with no dependencies"                 |
        | "type service with binding with request scope"      |
        | "type service with binding with singleton scope"    |
        | "type service with binding with transient scope"    |
