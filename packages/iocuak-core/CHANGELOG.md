# Changelog

## 0.3.1

### Patch Changes

- e80c8c7: Updated `ContainerModuleMetadata` arguments to be `any[]` by default.

## 0.3.0 - 2023-02-24

### Minor Changes

- 66481f6: Provided both `esm` and `cjs` modules.

### Patch Changes

- Updated dependencies [68e1657]
- Updated dependencies [e7107eb]
- Updated dependencies [d69f4d4]
  - @cuaklabs/iocuak-common@0.3.0
  - @cuaklabs/iocuak-reflect-metadata-utils@0.2.0
  - @cuaklabs/iocuak-models@0.2.0

## 0.2.0 - 2023-02-05

### Minor Changes

- ab875a3: Added `loadContainerModuleMetadataArray`
- 7e991c5: [BC] Updated `ServiceDependencies` with readonly properties
- f5eee49: [BC] Removed `getDependencies`.
- f5eee49: [BC] Removed `createInstanceFromBinding`
- 1e83f29: Added `ContainerModuleMetadataBase`
- 2a94fb8: Added `createCreateInstanceTaskContext`
- 10abb28: Updated `ContainerModuleMetadataBase` with `requires` field
- 9dfb285: [BC]: Renamed `TaskContext` to `CreateInstanceTaskContext`
- 753752a: Added `LoadModuleMetadataTaskContext`
- 8ae710e: [BC] removed `getBindingOrThrow`
- 2faeac3: [BC] Removed `loadContainerModule`
- 2d9e969: Added `bind`
- 770a65a: Updated `TaskContextServices` with readonly properties.

### Patch Changes

- Updated dependencies [c4861bc]
- Updated dependencies [42198a4]
  - @cuaklabs/iocuak-common@0.2.0
  - @cuaklabs/iocuak-models@0.1.2
  - @cuaklabs/iocuak-reflect-metadata-utils@0.1.2

## 0.1.1 - 2022-12-28

### Changed

- Updated `@cuaklabs/*` dependencies.

## 0.1.0 - 2022-11-09

### Added

- Added `BindingService`.
- Added `BindingServiceImplementation`.
- Added `ContainerModule`.
- Added `ContainerModuleClassMetadata`.
- Added `ContainerModuleFactoryMetadata`.
- Added `ContainerModuleMetadata`.
- Added `ContainerModuleMetadataType`.
- Added `ContainerRequestService`.
- Added `ContainerRequestServiceImplementation`.
- Added `ContainerSingletonService`.
- Added `ContainerSingletonServiceImplementation`.
- Added `createInstance`.
- Added `createInstanceFromBinding`.
- Added `createInstancesByTag`.
- Added `getBindingMetadata`.
- Added `getBindingOrThrow`.
- Added `getClassMetadata`.
- Added `getDependencies`.
- Added `loadContainerModule`.
- Added `TaskContext`.
- Added `TaskContextActions`.
- Added `TaskContextServices`.
