Feature: Load module metadata

  Any module instance can be loaded. When a module metadata is loaded, all
  its depdendencies are loaded. After that, the module associated to the metadata
  is loaded.

  Background: Having a container
  Given a container

  Rule: Any imported container is loaded. Then, the module is loaded.

    Scenario Outline: Load container metadata

      Given a <container_module_metadata>
      When the container module metadata is loaded
      Then container metadata container metadata imports are initialized
      And container metadata container metadata imports are loaded
      And container metadata is initialized
      And container metadata is loaded

      Examples:
        | container_module_metadata                                                         |
        | "container module metadata with imports with container module factory metadata"   |
        | "container module metadata with imports with container module class metadata"     |
        | "container module metadata with factory"                                          |
        | "container module metadata with module"                                           |
