import { inject } from '@angular/core';
import { RedirectFunction, Route } from '@angular/router';
import { aboutUsRoutes } from '@storefront/feature/about-us';
import { catalogRoutes } from '@storefront/feature/catalog';
import { contactsRoutes } from '@storefront/feature/contacts';
import { homeRoutes } from '@storefront/feature/home';
import { notFoundRoutes } from '@storefront/feature/not-found';
import { orderInBulkRoutes } from '@storefront/feature/order-in-bulk';
import { regionsRoutes } from '@storefront/feature/regions';
import { LocaleNavigationService } from '@storefront/util';

const redirectToLocalizedPath: RedirectFunction = (redirectData) => {
  const localeNavigation = inject(LocaleNavigationService);
  const locale = localeNavigation.getCurrentLocale();
  const normalizedPath = redirectData.url.map((segment) => segment.path).join('/');

  if (!normalizedPath) {
    return `/${locale}`;
  }

  return `/${locale}/${normalizedPath}`;
};

const localizedRoutes: Route[] = [
  ...homeRoutes,
  ...contactsRoutes,
  ...aboutUsRoutes,
  ...catalogRoutes,
  ...orderInBulkRoutes,
  ...regionsRoutes,
  ...notFoundRoutes,
  {
    path: '**',
    redirectTo: '404',
  },
];

export const appRoutes: Route[] = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'uk',
  },
  {
    path: 'uk',
    children: localizedRoutes,
  },
  {
    path: 'ru',
    children: localizedRoutes,
  },
  {
    path: '**',
    redirectTo: redirectToLocalizedPath,
  },
];
