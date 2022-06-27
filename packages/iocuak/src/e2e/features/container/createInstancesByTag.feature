Feature: Create instances by tag

  Containers are able to create services by tag whenever the service is bound to the tag and all its dependencies are bound

  Background: Having a container
  Given a container
  Given a tag

  Rule: Any bound type service is instantiated

    Scenario: Bound value service request
      Given a "value service"
      When the value service is bound to the tag
      And instaces by tag are requested
      Then an array with the value service is returned

    Scenario Outline: Bound type service request
      Given a <type_service>
      When the type binding is updated to include the tag
      And the type service dependencies are bound
      And the type service is bound
      And instaces by tag are requested
      Then an array with an instance from the type service is returned

      Examples:
        | type_service                                        |
        | "type service with no dependencies"                 |
        | "type service with binding with request scope"      |
        | "type service with binding with singleton scope"    |
        | "type service with binding with transient scope"    |
        | "type service with constructor parameters"          |
        | "type service with properties"                      |
