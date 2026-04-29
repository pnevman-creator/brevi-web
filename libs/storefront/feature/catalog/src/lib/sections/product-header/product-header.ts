import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

@Component({
  selector: 'lib-product-header',
  imports: [PageHeader],
  templateUrl: './product-header.html',
  styleUrl: './product-header.scss',
})
export class ProductHeader {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly productPageConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('catalog.productPage.title'),
      breadcrumbs: [
        this.transloco.translate('shared.home'),
        this.transloco.translate('catalog.productsList.pageTitle'),
        this.transloco.translate('catalog.productsList.sectionTitle'),
        this.transloco.translate('catalog.productPage.title'),
      ],
      showSearch: false,
    };
  });
}
