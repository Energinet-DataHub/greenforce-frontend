import { Type } from "@angular/core";
import { MountConfig, mount } from "cypress/angular";

declare const window: {
  serviceWorkerRegistration: Promise<unknown> | undefined;
} & Window;

export async function mountAfterMSW<T>(component: string | Type<T>, config?: MountConfig<T>) {
  await window.serviceWorkerRegistration?.then(() => {
    mount<T>(component, config);
  });
}
