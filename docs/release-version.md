# Releasing a version

1. Update changelog

2. Increase packages version

```
npx lerna version (patch|minor|major) --force-publish
```

3. Login in npm 

```
npm login
```

4. Publish all the packages

```
npm run publish:packages
```