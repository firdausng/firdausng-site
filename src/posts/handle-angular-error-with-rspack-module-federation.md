---
title: 'Handling remote-load errors in Angular Module Federation v2 with Rspack'
date: "2025-03-02"
updated: "2026-04-22"
description: How to show a graceful fallback component when a Module Federation v2 remote fails to load in an Nx + Angular + Rspack setup, using the errorLoadRemote runtime plugin.
categories:
  - rspack
  - angular
  - module federation
  - nx
author: Me
published: true
featured: true
---
When a Module Federation v2 remote fails to load — network blip, bad deploy, expired tab — the default behaviour is an unhandled exception somewhere deep in your shell app. Here's how to intercept that and render a fallback component instead, in an Nx + Angular + Rspack setup.
If you have no clue how to set up module federation v2 with rspack and angular, here is a great article written by Manfred Steyer you read about that: [Nx and Angular with Rspack and Module Federation](https://www.angulararchitects.io/en/blog/nx-with-rspack-and-module-federation/).
> you can scaffold new nx workspace using this command `npx create-nx-workspace@latest --preset=apps` 

> My example is using `19.0.0-alpha.13` for packages `@ng-rsbuild/plugin-angular` and `@ng-rsbuild/plugin-nx` because the latest version of these package seems broken.

## errorLoadRemote
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

## Why `errorLoadRemote` beats a global error handler

Angular's `ErrorHandler` catches the exception but by the time it fires, the router outlet is already broken — you end up with a blank area and a stack trace in the console, not a graceful fallback. `errorLoadRemote` intercepts at the Module Federation runtime layer, before Angular ever tries to mount the component, and the value you return *is* the component Angular uses. The outlet renders a real component; the user sees a real message.

It's also per-remote by design. The `args` parameter carries the remote name and the specific error — if you need different fallbacks per microfrontend (e.g. a lightweight inline message for a header widget, a full-page error for a checkout flow), you branch on `args.from` and return different components. A global `ErrorHandler` can't do that without reaching for private Angular internals.

## References

- [Nx and Angular with Rspack and Module Federation](https://www.angulararchitects.io/en/blog/nx-with-rspack-and-module-federation/) — Manfred Steyer's setup guide
- [Module Federation runtime plugin API](https://module-federation.io/plugin/dev/index.html)

