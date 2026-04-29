import { Route } from '@angular/router';

export const aboutUsRoutes: Route[] = [
  {
    path: 'about-company',
    loadComponent: () =>
      import('./pages/about-company/about-company.page').then((m) => m.AboutCompanyPage),
  },
  {
    path: 'delivery-and-payment',
    loadComponent: () =>
      import('./pages/delivery-and-payment/delivery-and-payment.page').then(
        (m) => m.DeliveryAndPaymentPage,
      ),
  },
  {
    path: 'articles',
    loadComponent: () => import('./pages/articles/articles.page').then((m) => m.ArticlesPage),
  },
  {
    path: 'agreement',
    loadComponent: () => import('./pages/agreement/agreement.page').then((m) => m.AgreementPage),
  },
  {
    path: 'returns-exchanges',
    loadComponent: () =>
      import('./pages/returns-exchanges/returns-exchanges.page').then(
        (m) => m.ReturnsExchangesPage,
      ),
  },
  {
    path: 'our-work',
    loadComponent: () => import('./pages/our-work/our-work.page').then((m) => m.OurWorkPage),
  },
  {
    path: 'certificates',
    loadComponent: () =>
      import('./pages/certificates/certificates.page').then((m) => m.CertificatesPage),
  },
];
