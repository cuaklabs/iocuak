Feature: Get service binding

    Containers provides binding features to register types and values. When a type is bound, its metadata is
    registered, allowing the container to infer how to create instances of that type if every dependency
    is also bound.

    Rule: Any bound service metadata is provided

        Background: Having a container
        Given a container

    Scenario: A type service is bound
        Given a type service
        When the type service is bound
        And container metadata is requested
        Then service metadata is included in the result

    Scenario: A value service is bound
        Given a value service
        When the value service is bound
        And container metadata is requested
        Then service metadata is included in the result
