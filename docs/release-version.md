# Releasing a version

1. Update changelog

2. Increase packages version

```
pnpx lerna version (patch|minor|major) --force-publish
```

3. Login in npm 

```
npm login
```

4. Publish all the packages

**Warning**: the use of `pnpm workspaces` forces us to publish packages through `pnpm publish`

```
pnpm run prepublish:packages
```

Then, for each package, navigate to the package folder and run `pnpm publish`