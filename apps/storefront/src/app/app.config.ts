import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import {
  provideClientHydration,
  withEventReplay,
  withHttpTransferCacheOptions,
  withIncrementalHydration,
} from '@angular/platform-browser';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideApiAndLogging, provideGlobalErrorHandling } from '@shared/config';
import {
  baseUrlInterceptor,
  errorInterceptor,
  loggingInterceptor,
} from '@shared/http';
import { BreviStorePreset } from '@shared/theme';
import { createPrimeNgConfig } from '@shared/ui';
import { providePrimeNG } from 'primeng/config';

import { appRoutes } from './app.routes';
import { TRANSLOCO_PROVIDERS } from './localization/transloco.providers';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    ...provideApiAndLogging(environment),
    provideHttpClient(
      withFetch(),
      withInterceptors([baseUrlInterceptor, loggingInterceptor, errorInterceptor]),
    ),
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      appRoutes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
      }),
      withComponentInputBinding(),
    ),
    provideClientHydration(
      withEventReplay(),
      withIncrementalHydration(),
      withHttpTransferCacheOptions({
        includePostRequests: false,
      }),
    ),
    ...provideGlobalErrorHandling(),
    ...TRANSLOCO_PROVIDERS,
    providePrimeNG(createPrimeNgConfig(BreviStorePreset)),
  ],
};
