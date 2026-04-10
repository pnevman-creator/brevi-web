import { DOCUMENT, PlatformLocation } from '@angular/common';
import { Injectable, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

import { environment } from '../../environments/environment';

type SupportedLocale = 'uk' | 'ru';

@Injectable({ providedIn: 'root' })
export class SeoHreflangService {
  private readonly document = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly platformLocation = inject(PlatformLocation);
  private readonly siteBaseUrl = this.normalizeSiteBaseUrl(
    environment.publicSiteUrl,
  );

  private readonly currentNavigationUrl = toSignal(
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd),
      map((event) => event.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  private readonly updateSeoLinksEffect = effect(() => {
    const url = this.currentNavigationUrl();
    this.updateSeoLinks(url);
  });

  private updateSeoLinks(navigationUrl: string): void {
    const localePath = this.normalizePath(
      this.stripLocalePrefix(navigationUrl),
    );
    const currentLocale = this.detectLocale(navigationUrl);

    const canonicalPath = this.buildLocalizedPath(currentLocale, localePath);
    const ukrainianPath = this.buildLocalizedPath('uk', localePath);
    const russianPath = this.buildLocalizedPath('ru', localePath);

    this.setLink('canonical', this.buildAbsoluteUrl(canonicalPath));
    this.setLink('alternate', this.buildAbsoluteUrl(ukrainianPath), 'uk-UA');
    this.setLink('alternate', this.buildAbsoluteUrl(russianPath), 'ru-UA');
    this.setLink(
      'alternate',
      this.buildAbsoluteUrl(ukrainianPath),
      'x-default',
    );
  }

  private setLink(rel: string, href: string, hreflang?: string): void {
    const selector = hreflang
      ? `link[rel="${rel}"][hreflang="${hreflang}"]`
      : `link[rel="${rel}"]:not([hreflang])`;

    let linkElement = this.document.head.querySelector(
      selector,
    ) as HTMLLinkElement | null;

    if (!linkElement) {
      linkElement = this.document.createElement('link');
      linkElement.setAttribute('rel', rel);
      if (hreflang) {
        linkElement.setAttribute('hreflang', hreflang);
      }
      this.document.head.appendChild(linkElement);
    }

    linkElement.setAttribute('href', href);
  }

  private detectLocale(pathWithLocale: string): SupportedLocale {
    const localeFromPath = pathWithLocale.split('/').filter(Boolean)[0];
    if (localeFromPath === 'ru') {
      return 'ru';
    }
    if (localeFromPath === 'uk') {
      return 'uk';
    }

    const baseHref = this.platformLocation.getBaseHrefFromDOM() || '/';
    if (baseHref.startsWith('/ru')) {
      return 'ru';
    }
    return 'uk';
  }

  private normalizePath(rawPath: string): string {
    const pathWithoutQuery = rawPath.split(/[?#]/)[0] ?? '/';
    const normalizedPath = pathWithoutQuery.startsWith('/')
      ? pathWithoutQuery
      : `/${pathWithoutQuery}`;

    return normalizedPath === '/' ? '/' : normalizedPath.replace(/\/+$/, '');
  }

  private stripLocalePrefix(path: string): string {
    return path.replace(/^\/(?:uk|ru)(?=\/|$)/, '') || '/';
  }

  private buildLocalizedPath(
    locale: SupportedLocale,
    localePath: string,
  ): string {
    return localePath === '/' ? `/${locale}/` : `/${locale}${localePath}`;
  }

  private buildAbsoluteUrl(path: string): string {
    return `${this.siteBaseUrl}${path}`;
  }

  private normalizeSiteBaseUrl(rawBaseUrl: string): string {
    return rawBaseUrl.replace(/\/+$/, '');
  }
}
