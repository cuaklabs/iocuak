# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!--
## [UNRELEASED]

### Added
### Changed
### Deprecated
### Removed
### Fixed
### Security
### Docs
-->




## [UNRELEASED]

### Added
- Added `Binding`
- Added `ClassMetadata`
- Added `MetadataProvider`.
- Added `MetadataService`
- Added `TypeBinding`
- Added `ValueBinding`

### Changed
- Updated `ContainerApi` with `build` and `createChild` methods.
- `ContainerServiceApi` interface is now exposed.
- [BC]: Updated `ContainerApi` constructor to be private.
- [BC]: Renamed `BindingApi` to `InjectableOptions`.
- [BC]: Renamed `TaskScope` to `BindingScope`.
- [BC]: Renamed `ContainerApi` to `Container`.



## v0.0.7 - 2021-11-09

### Changed
- `Binding` model is no longer exposed
- `BindingApi` model is now exposed.
- `TaskScope` enum is now exposed.
- Updated `ContainerBindingApiService` with `bindToValue`.
- Updated `TaskScope` with `request` scope.
- Updated `inject` to throw an error if it's not used in a constructor parameter.




## v0.0.6 - 2021-10-25

### Changed
- Updated npm config to ignore source files.




## v0.0.5 - 2021-10-25

### Changed
- Updated npm publish config with public access.




## v0.0.4 - 2021-10-25

### Added
- Added `Binding`.
- Added `ContainerApi`.
- Added `ContainerModuleApi`.
- Added `inject`.
- Added `injectable`.
- Added `injectFrom`.
- Added `injectFromBase`.
- Added `Newable`.
- Added `ServiceId`.



