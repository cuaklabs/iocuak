Feature: Unbind service

  Any bound service can be unbound from a container. When a service is unbound, its bindings are 
  removed from the container. If the service was bound on singleton scope, the cache is cleared for
  that specific service.

  Background: Having a container
  Given a container

  Rule: A service is unbound successfully

    Scenario: Value service binding
      Given a "value service"
      When the value service is bound
      And the value service is unbound
      And container metadata is requested
      Then value service metadata is not included in the result

    Scenario: Injectable type service binding
      Given a "type service with any binding"
      When the type service is bound
      And the type service is unbound
      And container metadata is requested
      Then type service metadata is not included in the result

  Rule: When a singleton type service is unbound, cache is cleared for that service

    Scenario: Bind, unbind and bind again service on singleton scope
      Given a "type service with binding with singleton scope"
      When the type service is bound
      And an instace of the type service is requested
      And the type service is unbound
      And the type service is bound
      And a second instace of the type service is requested
      Then both first and second type services are not the same one
