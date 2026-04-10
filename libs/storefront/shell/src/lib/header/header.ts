import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { ThemeService } from '@shared/ui';
import { LocaleNavigationService } from '@storefront/util';
import { ButtonModule } from 'primeng/button';
import { MegaMenu } from 'primeng/megamenu';
import { StyleClassModule } from 'primeng/styleclass';
import { ToggleButtonModule } from 'primeng/togglebutton';

import { HEADER_MEGA_MENU_PT } from './header.mega-menu.pt';
import { buildMenu } from './header.menu';

@Component({
  selector: 'lib-header',
  imports: [
    CommonModule,
    ButtonModule,
    StyleClassModule,
    NgOptimizedImage,
    ToggleButtonModule,
    FormsModule,
    RouterLink,
    MegaMenu,
    TranslocoPipe,
  ],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  public readonly themeService = inject(ThemeService);
  private readonly transloco = inject(TranslocoService);
  private readonly localeNavigation = inject(LocaleNavigationService);

  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly items = computed(() => {
    this.activeLang();
    const currentLocale = this.localeNavigation.getCurrentLocale();
    return buildMenu(currentLocale, (key) => this.transloco.translate(key));
  });

  readonly homeLink = computed(() => {
    const currentLocale = this.localeNavigation.getCurrentLocale();
    return ['/', currentLocale];
  });

  constructor() {
    this.themeService.init();
  }

  public readonly megaMenuPt = HEADER_MEGA_MENU_PT;
}
