import type { PanelMenuPassThrough } from 'primeng/types/panelmenu';

export const SIDEBAR_PANEL_MENU_PT = {
  root: { class: 'w-full border-0 bg-transparent shadow-none' },
  panel: { class: 'border-0 bg-transparent shadow-none' },
  header: { class: 'border-0 bg-transparent' },
  headerContent: { class: 'border-0 bg-transparent' },
  headerLink: {
    class:
      'flex items-center justify-start gap-3 rounded-xl border border-transparent px-3 py-3 text-surface-900 transition-colors duration-150 hover:border-surface-200 hover:bg-surface-50 dark:text-surface-0 dark:hover:border-surface-700 dark:hover:bg-surface-800',
  },
  headerLabel: {
    class:
      'text-xs font-semibold uppercase tracking-[0.18em] text-surface-500 dark:text-surface-400',
  },
  headerIcon: {
    class: 'text-base! leading-none! text-surface-500 dark:text-surface-400',
  },
  contentContainer: { class: 'border-0 bg-transparent' },
  contentWrapper: { class: 'pt-1' },
  content: { class: 'border-0 bg-transparent' },
  rootList: { class: 'm-0 flex list-none flex-col gap-4 p-0' },
  item: { class: 'border-0 bg-transparent' },
  itemContent: { class: 'border-0 bg-transparent' },
  itemLink: {
    class:
      'flex w-full items-center justify-start gap-3 rounded-lg border border-transparent px-3 py-2.5 text-left text-surface-700 transition-colors duration-150 hover:border-surface-200 hover:bg-surface-50 hover:text-surface-900 dark:text-surface-200 dark:hover:border-surface-700 dark:hover:bg-surface-800 dark:hover:text-surface-50',
  },
  itemIcon: {
    class: 'w-5 text-base! leading-none! text-surface-500 dark:text-surface-400',
  },
  itemLabel: { class: 'font-medium text-sm leading-tight' },
  submenuIcon: {
    class: 'order-last ml-auto text-surface-500 dark:text-surface-400',
  },
  submenu: { class: 'm-0 flex list-none flex-col gap-1 p-0 pl-2' },
} satisfies PanelMenuPassThrough;
