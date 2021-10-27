# Introduction

Well, if I was a user who lands on this page, I would expect these thoughts in his/her minds:

What is the purpose of this library? Why should I use this library? Does it fit my use case? God it's not too popular on npm, I may use a custom implementation instead...

So many questions, let's provide some answers:

## What is the purpose of this library

This library is an **abstract task manager**. It allows you to define tasks with dependencies in order to easily generate and run them.

**Example:**

Alice, a world class software developer, is helping the QA team in an e-commerce proyect to automatically setup environments with all the use cases required to launch e2e tests. Alice knows every use case setup is composed by a set of well known dependent tasks. As an example, a product registration use case requires a vendor account registration. Those two actions can be represented as two dependent tasks.

Alice decides to use our brand new library and provides an API able to easily setup the environment through the execution of dependent tasks. Alice succedes and gets a salary bonus reward 📈💰.

## Why should I use this library?

Well, you should not. This library is currently used to provide a task manager to [`iocuak`](https://github.com/cuaklabs/cuaktask/tree/master/packages/iocuak) and, even if it's under active maintenance, non server versions are the only ones provided so **updates may include breaking changes**. If you are really interested on the library feel free to submit an issue requesting an 1.X version.

## Does it fit my use case?

Do you want to dinamically create tasks establishing a dependency tree? Then this library probably fits your use case.

Before using this library, here are some caveats:

- This library does not create snapshots nor provides a way to recover from an error while a task is being executed.
- This library is designed to perform asyncronous tasks.
- This library is not designed to perform concurrent tasks.

## So, what now?

Do you still want to use or understand this library? Nice, it's time to dive into the [next page](./2-the-big-picture)!
