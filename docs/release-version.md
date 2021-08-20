# Releasing a version

1. Increase packages version

```
npx lerna version (patch|minor|major) --force-publish
```

2. Login in npm 

```
npm login
```

3. Publish all the packages

```
npx lerna publish --force-publish
```