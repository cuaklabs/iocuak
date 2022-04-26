Feature: Bind service

  Any injectable service can be bound to a container. When a service is bound, it's possible to create instances
  depending on the bound services.

  Background: Having a container
  Given a container

  Rule: A value service is bound successfully

    Scenario: A value service is bound with no errors
      Given a "value service"
      When the value service is bound
      Then no errors are thrown

  Rule: An injectable type service is bound successfully

    Scenario: An injectable service is bound with no errors
      Given a "type service with any binding"
      When the type service is bound
      Then no errors are thrown

  Rule: A non injectable type service is not bound successfully

    Scenario: An injectable service is bound with no errors
      Given a "type service with no binding"
      When the type service is bound
      Then an error containing "No bindings found for type" is thrown
