import { dashboardRoutes } from '@admin/feature/dashboard';
import { referencesRoutes } from '@admin/feature/references';
import { Route } from '@angular/router';

export const appRoutes: Route[] = [
  ...dashboardRoutes,
  {
    path: 'references',
    children: referencesRoutes,
  },
];
