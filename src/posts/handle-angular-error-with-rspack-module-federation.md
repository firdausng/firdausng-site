﻿---
title: 'Handle Angular module error with Rspack module federation and Nx'
date: "2025-03-02"
description: In this article I am going to take a look on how to handle error on Module federation v2 using angular and nx. 🚀
categories:
  - rspack
  - angular
  - module federation
  - nx
author: Me
published: true
featured: true
---
In this article I am going to take a look on how to handle error on Module federation v2 using angular and nx.
If you have no clue how to set up module federation v2 with rspack and angular, here is a great article written by Manfred Steyer you read about that: [Nx and Angular with Rspack and Module Federation](https://www.angulararchitects.io/en/blog/nx-with-rspack-and-module-federation/).
> you can scaffold new nx workspace using this command `npx create-nx-workspace@latest --preset=apps` 

> My example is using `19.0.0-alpha.13` for packages `@ng-rsbuild/plugin-angular` and `@ng-rsbuild/plugin-nx` because the latest version of these package seems broken.

# errorLoadRemote
This is a plugin provided by Module federation v2 to intercept error from loading the remote so that we can handle the error gracefully.

We can use this to provide error component when we failed to load the remote. First we need to have an error component such as below

```ts
// shell/src/app/error.component.ts
import {Component} from '@angular/core';

@Component({
    selector: 'app-error',
    template: `
        <h1>Error Loading remote component!</h1>
    `,
    standalone: true
})
export class ErrorComponent{
}
```
Then we can use this component in Module federation such as below

```ts
// shell/src/main.ts
import { FederationRuntimePlugin, init } from '@module-federation/enhanced/runtime';
import { ErrorComponent } from './app/error.component';

const fallbackPlugin: () => FederationRuntimePlugin = function () {
 return {
   name: 'fallback-plugin',
   errorLoadRemote(args) {
     return ErrorComponent;
   },
 };
};
```




# References
- https://www.angulararchitects.io/en/blog/nx-with-rspack-and-module-federation/
- https://module-federation.io/plugin/dev/index.html

