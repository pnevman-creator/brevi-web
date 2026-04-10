import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'uk',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'ru',
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'uk/catalog',
    renderMode: RenderMode.Client,
  },
  {
    path: 'ru/catalog',
    renderMode: RenderMode.Client,
  },
  {
    path: 'uk/product-page',
    renderMode: RenderMode.Client,
  },
  {
    path: 'ru/product-page',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender,
  },
];
