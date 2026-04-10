import { APP_INITIALIZER } from '@angular/core';
import {
  provideTransloco,
  translocoConfig,
  TranslocoService,
} from '@jsverse/transloco';
import { LocaleNavigationService, StorefrontLocale } from '@storefront/util';
import { PrimeNG } from 'primeng/config';
import { firstValueFrom } from 'rxjs';

import { TranslocoHttpLoader } from './transloco.loader';
import { environment } from '../../environments/environment';

const SUPPORTED_LANGS: StorefrontLocale[] = ['uk', 'ru'];

function initializeTransloco(
  translocoService: TranslocoService,
  localeNavigation: LocaleNavigationService,
  primeNg: PrimeNG,
): () => Promise<void> {
  return async () => {
    const locale = localeNavigation.getCurrentLocale();
    await firstValueFrom(translocoService.load(locale));
    translocoService.setActiveLang(locale);

    const applyPrimeNgTranslations = () => {
      primeNg.setTranslation({
        emptyMessage: translocoService.translate(
          'catalog.productList.empty.title',
        ),
      });
    };

    applyPrimeNgTranslations();
    translocoService.langChanges$.subscribe(() => applyPrimeNgTranslations());
  };
}

export const TRANSLOCO_PROVIDERS = [
  provideTransloco({
    config: translocoConfig({
      availableLangs: SUPPORTED_LANGS,
      defaultLang: 'uk',
      fallbackLang: 'uk',
      reRenderOnLangChange: true,
      prodMode: environment.production,
    }),
    loader: TranslocoHttpLoader,
  }),
  {
    provide: APP_INITIALIZER,
    multi: true,
    deps: [TranslocoService, LocaleNavigationService, PrimeNG],
    useFactory: initializeTransloco,
  },
];
