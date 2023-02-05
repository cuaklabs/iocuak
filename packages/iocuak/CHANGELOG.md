# Changelog

## 0.5.0 - 2023-02-05

### Minor Changes

- d0daf88: Updated `Container` to avoid loading duplicated `ContainerModuleMetadata`.
- 5f33611: Updated `ContainerModuleMetadataBase` with optional id.

### Patch Changes

- Updated dependencies [38d2193]
- Updated dependencies [ab875a3]
- Updated dependencies [7e991c5]
- Updated dependencies [f5eee49]
- Updated dependencies [f5eee49]
- Updated dependencies [1e83f29]
- Updated dependencies [af81ab7]
- Updated dependencies [2a94fb8]
- Updated dependencies [c4861bc]
- Updated dependencies [10abb28]
- Updated dependencies [42198a4]
- Updated dependencies [9dfb285]
- Updated dependencies [753752a]
- Updated dependencies [8ae710e]
- Updated dependencies [2faeac3]
- Updated dependencies [2d9e969]
- Updated dependencies [770a65a]
  - @cuaklabs/iocuak-core@0.2.0
  - @cuaklabs/iocuak-common@0.2.0
  - @cuaklabs/iocuak-decorators@0.1.2
  - @cuaklabs/iocuak-models@0.1.2
  - @cuaklabs/iocuak-models-api@0.1.2

## 0.4.0 - 2022-12-28

### Added

- Added `BindOptions`.

### Changed

- Updated dependencies require `reflect-metadata` as dev dependency.
- Updated dependencies with `@cuaklabs/iocuak-` internal libraries.
- Updated `BindService.bind` with options.

## 0.3.1 - 2022-07-09

### Changed

- Updated `ContainerModuleFactoryMetadata.injects` to allow `ClassElementMetadata`.

## 0.3.0 - 2022-06-28

### Added

- Added `Tag`.
- Added `BindValueOptions`.
- Added `ClassElementMetadata`.
- Added `ClassElementMetadatType`.
- Added `ClassElementServiceIdMetadata`.
- Added `ClassElementTagMetadata`.
- Added `injectTag`.

### Changed

- Updated `Container` with `getByTag`.
- Updated `ContainerModuleMetadata` to allow module classes and modules.
- Updated `InjectableOptions` with tags.
- [BC]: Updated `ClassMetadata` to contain `ClassElementMetadata` based properties and constructor arguments.
- [BC]: Updated `Container.bindToValue` to require `BindValueOptions`.

## 0.2.1 - 2022-04-30

### Changed

- Updated `Container.get` to create instance of newable unbinded types.
- Updated `ContainerModuleMetadata` to allow class metadata
- Updated `ContainerModuleMetadata.imports` to be optional.
- Updated `ContainerModuleMetadata.injects` to be optional.

### Fixed

- Fixed `Container.unbind` to remove unbound singleton services
- Fixed `Container.get` to successfully create request scoped services instances.

## 0.2.0 - 2022-04-19

### Added

- Added `BindingType`.
- Added `ContainerModuleBindingService`.
- Added `ContainerModuleMetadata`

### Changed

- Updated `ContainerModuleServiceApi` with `loadMetadata`.
- Updated `ContainerModule` to receive a `ContainerModuleBindingService`.

## 0.1.1 - 2022-03-08

### Fixed

- Fixed wrong compiled files.

## 0.1.0 - 2022-03-08

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
