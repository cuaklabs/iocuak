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

```
pnpm run publish:packages
```