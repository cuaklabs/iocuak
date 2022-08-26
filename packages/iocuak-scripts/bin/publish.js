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

async function publishPackage(packageDirectory) {
  const packageJsonObject = await getPackageJsonFileObject(packageDirectory);
  const packageName = getPackageJsonFileName(packageJsonObject);

  if (shouldPublishPackage(packageDirectory)) {
    try {
      await promisifiedExec(`pnpm --dir ${packageDirectory} publish`, true);
    } catch (error) {
      throw new Error(
        `Publish command failed. The error thrown is:
  ${error}`,
      );
    }
  } else {
    console.log(
      `Package ${packageName} is already published. Avoiding a publish operation attempt`,
    );
  }
}

async function shouldPublishPackage(packageDirectory) {
  const packageJsonObject = await getPackageJsonFileObject(packageDirectory);
  const localVersion = getPackageJsonFileVersion(packageJsonObject);
  const packageName = getPackageJsonFileName(packageJsonObject);
  const latestRemoteVersion = await getPackageRemoteVersion(packageName);

  return localVersion !== latestRemoteVersion;
}

const packageDirectory = resolve(argv[2]);

await publishPackage(packageDirectory);
