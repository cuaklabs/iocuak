Feature: Get service bindings

  Containers provides binding features to register types and values. When a type is bound, its metadata is
  registered, allowing the container to infer how to create instances of that type if every dependency
  is also bound.

  Background: Having a container
  Given a container

  Rule: Any bound service metadata is provided

    Scenario: Get metadata with bound type service
      Given a "type service"
      When the type service is bound
      And container metadata is requested
      Then type service metadata is included in the result

    Scenario: Get metadata with bound value service
      Given a "value service"
      When the value service is bound
      And container metadata is requested
      Then value service metadata is included in the result
