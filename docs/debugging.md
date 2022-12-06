# Debugging

There no specific tools for debugging.

Consider using the excellent vscode javascript debug terminal.

## How to use the vscode javascript debug terminal

- Consider [docs](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_javascript-debug-terminal) as reference.

## What if I want to use a non vscode solution?

The inspector protocol could come to the rescue here. No scripts are currently set for this purpose, but at the end this project has few entrypoints, most of them are pnpm scripts which, at the very end, invoke Node.js. A convenient update on those scripts would easily run a Node.js process with an open debugging port.

### Example: debugging unit tests

The unit tests are currently run as an pnpm script which triggers a turbo task which triggers several pnpm scripts which calls `jest`.

At the end end, several `test` scripts are run. Debugging unit `ContainerApi.spec.ts` test can be easilly accomplished calling node:

```bash
cd packages/iocuak

node --inspect-brk ./node_modules/jest/bin/jest.js --config ./jest.config.mjs --testMatch="<rootDir>/**/ContainerApi.spec.ts" --selectProjects="Unit"
```


