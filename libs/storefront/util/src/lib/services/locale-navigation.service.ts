import { PlatformLocation } from '@angular/common';
import { Injectable, inject } from '@angular/core';
import { BrowserStorageService } from '@shared/util';

export type StorefrontLocale = 'uk' | 'ru';

@Injectable({ providedIn: 'root' })
export class LocaleNavigationService {
  private readonly localeStorageKey = 'storefront.locale';
  private readonly storage = inject(BrowserStorageService);
  private readonly platformLocation = inject(PlatformLocation);

  getCurrentLocale(): StorefrontLocale {
    const localeFromPath = this.getLocaleFromPathname(
      this.platformLocation.pathname ?? '/',
    );
    if (localeFromPath) {
      this.saveLocale(localeFromPath);
      return localeFromPath;
    }

    const savedLocale = this.storage.getItem(this.localeStorageKey);
    if (savedLocale === 'uk' || savedLocale === 'ru') {
      return savedLocale;
    }

    return 'uk';
  }

  saveLocale(locale: StorefrontLocale): void {
    this.storage.setItem(this.localeStorageKey, locale);
  }

  localizedSegments(...segments: string[]): string[] {
    const locale = this.getCurrentLocale();
    const normalizedSegments = segments
      .map((segment) => this.normalizeSegment(segment))
      .filter(Boolean);
    return ['/', locale, ...normalizedSegments];
  }

  localizedPath(path: string): string[] {
    const segments = path.split('/').filter(Boolean);
    return this.localizedSegments(...segments);
  }

  localizedUrlForLocale(
    currentUrl: string,
    targetLocale: StorefrontLocale,
  ): string {
    const matchedUrl = /^(?<path>[^?#]*)(?<suffix>.*)$/.exec(currentUrl);
    const rawPath = matchedUrl?.groups?.['path'] ?? '/';
    const suffix = matchedUrl?.groups?.['suffix'] ?? '';

    const normalizedPath = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    const pathWithoutLocale =
      normalizedPath.replace(/^\/(?:uk|ru)(?=\/|$)/, '') || '/';

    const localizedPath =
      pathWithoutLocale === '/'
        ? `/${targetLocale}`
        : `/${targetLocale}${pathWithoutLocale}`;

    return `${localizedPath}${suffix}`;
  }

  private normalizeSegment(segment: string): string {
    return segment.replace(/^\/+|\/+$/g, '');
  }

  private getLocaleFromPathname(pathname: string): StorefrontLocale | null {
    const firstSegment = pathname.split('/').filter(Boolean)[0];
    if (firstSegment === 'uk' || firstSegment === 'ru') {
      return firstSegment;
    }

    return null;
  }
}
