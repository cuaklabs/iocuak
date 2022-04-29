Feature: Load module

  Any module instance can be loaded. When a module is loaded, every service binding call 
  inside the module is performed

  Background: Having a container
  Given a container

  Rule: Once a module is loaded, every service binding call inside the module is performed

    Given a "container module with a type service and a value service"
    When the container module is loaded
    And container metadata is requested
    Then container services metadata are included in the result
