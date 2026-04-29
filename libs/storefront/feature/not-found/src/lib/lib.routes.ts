import { Route } from '@angular/router';

export const notFoundRoutes: Route[] = [
  {
    path: '404',
    loadComponent: () =>
      import('./page/not-found-page/not-found.page').then((page) => page.NotFoundPage),
  },
];
