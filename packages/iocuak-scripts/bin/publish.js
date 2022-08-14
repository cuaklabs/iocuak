#!/usr/bin/env node

import { readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { argv } from 'node:process';

import { promisifiedExec } from '../src/promisifiedExec.js';

async function getPackageRemoteVersion(packageName) {
  let latestRemoteVersion;

  try {
    latestRemoteVersion = (
      await promisifiedExec(`npm view ${packageName} dist-tags.latest`)
    ).trim();
  } catch (_error) {
    latestRemoteVersion = undefined;
  }

  return latestRemoteVersion;
}

function getPackageJsonFilePath(packageDirectory) {
  return join(packageDirectory, 'package.json');
}

async function getPackageJsonFileContent(packageDirectory) {
  const filePath = getPackageJsonFilePath(packageDirectory);

  return (await readFile(filePath)).toString();
}

async function getPackageJsonFileObject(packageDirectory) {
  const fileContent = await getPackageJsonFileContent(packageDirectory);

  return JSON.parse(fileContent);
}

function getPackageJsonFileVersion(packageJsonObject) {
  return packageJsonObject.version;
}

function getPackageJsonFileName(packageJsonObject) {
  return packageJsonObject.name;
}

const packageDirectory = resolve(argv[2]);

const packageJsonObject = await getPackageJsonFileObject(packageDirectory);

const localVersion = getPackageJsonFileVersion(packageJsonObject);

const packageName = getPackageJsonFileName(packageJsonObject);

const latestRemoteVersion = await getPackageRemoteVersion(packageName);

if (localVersion === latestRemoteVersion) {
  console.log(
    `Package ${packageName} is already published. Avoiding a publish operation attempt`,
  );
} else {
  try {
    await promisifiedExec(`pnpm --dir ${packageDirectory} publish`, true);
  } catch (error) {
    console.error(
      `Publish command failed. The error thrown is:
${error}`,
    );
  }
}
