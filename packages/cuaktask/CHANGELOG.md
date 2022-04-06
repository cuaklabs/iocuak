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
- Added `SafeDependentTaskBuilder`

### Changed
- **[BC]** Updated `TaskDependencyBuilder` to no longer receive a set builder. Use `SafeDependentTaskBuilder` as replacement for the old `TaskDependencyBuilder`
- **[BC]** Updated `BaseTask` to throw an error if `perform` is called more than once.
- Updated `BaseTask` with a `result` property.




## 0.1.1 - 2022-03-08

### Fixed
- Fixed wrong compiled files.




## 0.1.0 - 2022-03-08

### Changed
- **[BC]** Updated `Builder` with better generic types




## v0.0.7 - 2021-11-09
- Parity with v0.0.6




## v0.0.6 - 2021-10-25
- Parity with v0.0.5




## v0.0.5 - 2021-10-25

### Added
### Changed
- Updated npm publish config with public access.




## v0.0.4 - 2021-10-25

### Added
- Added `SetLike` interface.

### Changed
- Breaking: Updated `BaseDependentTask` with a `TDependencyKind` generic type.
- Breaking: Updated `TaskDependencyEngine.getDependencies` with a `TDependencyKind` generic type.
- Breaking: Updated: `DependentTaskBuilder` with a `TDependencyKind` generic type.




## v0.0.3 - 2021-08-21

### Fixed
- Added missing compiled files




## v0.0.2 - 2021-08-21

### Added 
- Added `BaseDependentTask` abstract model.
- Added `BaseTask` abstract model.

### Docs
- Added changelog




## v0.0.1 - 2021-08-07

### Added
- Added `DependentTaskBuilder` abstract module.
- Added `DependentTaskRunner` abstract module.
- Added `TaskDependencyEngine` interface.
