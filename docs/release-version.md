# Releasing a version

1. Update changelog

2. Increase packages version

Then, for each package, navigate to the package folder and run:

```
pnpm version (patch|minor|major)
```

3. Create a tag and push it

4. Login in npm 

```
npm login
```

5. Publish all the packages

**Warning**: the use of `pnpm workspaces` forces us to publish packages through `pnpm publish`

```
pnpm run prepublish:packages
```

**Note**: Remember to check the package contents. You can use `pnpm pack` for this purpose.

Then, for each package, navigate to the package folder and run `pnpm publish`