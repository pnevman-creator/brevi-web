import { CommonModule } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';

type Review = {
  nameKey: string;
  dateKey: string;
  rating: number;
  avatar: string;
  commentKey: string;
};

@Component({
  selector: 'lib-product-page',
  imports: [CommonModule, FormsModule, ButtonModule, InputNumberModule, PageHeader, TranslocoPipe],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage {
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  color = 'black';
  size = '20L';
  liked = false;
  images = ['tabs-1.jpg', 'tabs-2.jpg', 'tabs-3.jpg', 'tabs-4.jpg'];
  selectedImageIndex = 0;
  quantity = 1;
  activeTab = 0;

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

  reviews: Review[] = [
    {
      nameKey: 'catalog.productPage.reviews.items.1.name',
      dateKey: 'catalog.productPage.reviews.items.1.date',
      rating: 4,
      avatar:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/avatar-kathryn.png',
      commentKey: 'catalog.productPage.reviews.items.1.comment',
    },
    {
      nameKey: 'catalog.productPage.reviews.items.2.name',
      dateKey: 'catalog.productPage.reviews.items.2.date',
      rating: 4,
      avatar:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/avatar-paul.png',
      commentKey: 'catalog.productPage.reviews.items.2.comment',
    },
    {
      nameKey: 'catalog.productPage.reviews.items.3.name',
      dateKey: 'catalog.productPage.reviews.items.3.date',
      rating: 4,
      avatar:
        'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/avatar-ronald.png',
      commentKey: 'catalog.productPage.reviews.items.3.comment',
    },
  ];
}
