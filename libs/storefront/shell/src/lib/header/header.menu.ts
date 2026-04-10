import { MegaMenuItem, MenuItem } from 'primeng/api';

import {
  CATALOG_COLUMNS,
  INFO_ABOUT_ITEMS,
  INFO_LEGAL_ITEMS,
  INFO_PROMO_ITEM,
  INFO_REGION_ITEMS,
  MENU_TEXT,
  type HeaderMenuLeaf,
  type HeaderMenuSection,
} from './header.constants';

export type HeaderLocale = 'uk' | 'ru';

const localizeLink = (locale: HeaderLocale, link: readonly string[]): string[] => {
  const segments = link
    .flatMap((item) => item.split('/'))
    .filter(Boolean);
  return ['/', locale, ...segments];
};

type TranslateFn = (key: string) => string;

const translateWithFallback = (translate: TranslateFn, value: string): string => {
  const translated = translate(value);
  return translated === value ? value : translated;
};

const toMenuLeaf = (
  item: HeaderMenuLeaf,
  locale: HeaderLocale,
  translate: TranslateFn,
): MenuItem => ({
  label: translateWithFallback(translate, item.label),
  routerLink: localizeLink(locale, item.routerLink),
});

const toMenuSection = (
  section: HeaderMenuSection,
  locale: HeaderLocale,
  translate: TranslateFn,
): MenuItem => ({
  label: translateWithFallback(translate, section.label),
  items: section.items?.map((item) => toMenuLeaf(item, locale, translate)),
});

const buildCatalogItems = (
  locale: HeaderLocale,
  translate: TranslateFn,
): MegaMenuItem['items'] =>
  CATALOG_COLUMNS.map((column) =>
    column.map((section) => toMenuSection(section, locale, translate)),
  );

const buildInfoItems = (
  locale: HeaderLocale,
  translate: TranslateFn,
): MegaMenuItem['items'] => [
  [
    {
      label: translate(MENU_TEXT.information),
      items: INFO_ABOUT_ITEMS.map((item) => toMenuLeaf(item, locale, translate)),
    },
  ],
  [
    {
      label: translate('header.menu.regions'),
      items: INFO_REGION_ITEMS.map((item) => toMenuLeaf(item, locale, translate)),
    },
  ],
  [toMenuSection(INFO_LEGAL_ITEMS, locale, translate)],
  [
    {
      items: [
        {
          image: INFO_PROMO_ITEM.image,
          label: translateWithFallback(translate, INFO_PROMO_ITEM.label),
          routerLink: localizeLink(locale, [INFO_PROMO_ITEM.routerLink]),
          subtext: translateWithFallback(translate, INFO_PROMO_ITEM.subtext),
        },
      ],
    },
  ],
];

export function buildMenu(
  locale: HeaderLocale,
  translate: TranslateFn,
): MegaMenuItem[] {
  return [
    {
      label: translate(MENU_TEXT.catalog),
      icon: 'pi pi-bookmark-fill',
      root: true,
      items: buildCatalogItems(locale, translate),
    },
    {
      label: translate(MENU_TEXT.information),
      icon: 'pi pi-exclamation-circle',
      root: true,
      items: buildInfoItems(locale, translate),
    },
  ];
}
