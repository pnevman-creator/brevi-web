import { NgOptimizedImage } from '@angular/common';
import { Component, DestroyRef, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { BrowserStorageService } from '@shared/util';
import { MenuItem } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';
import { filter } from 'rxjs';

import { SIDEBAR_PANEL_MENU_PT } from './sidebar.panel-menu.pt';

interface SidebarState {
  expandedKeys: string[];
}

const SIDEBAR_STATE_KEY = 'admin.sidebar.state.v1';

@Component({
  selector: 'lib-sidebar',
  imports: [
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    NgOptimizedImage,
    PanelMenuModule,
    StyleClassModule,
    RouterLink,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  private readonly storage = inject(BrowserStorageService);

  readonly menuItems: MenuItem[] = this.createMenuItems();
  readonly panelMenuPt = SIDEBAR_PANEL_MENU_PT;

  constructor() {
    this.restoreExpandedState();
    this.syncExpandedStateFromRoute(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.syncExpandedStateFromRoute(event.urlAfterRedirects);
        this.persistState();
      });
  }

  private createMenuItems(): MenuItem[] {
    return [
      {
        key: 'service-manager',
        label: 'Менеджер сервісу',
        icon: 'pi pi-briefcase',
        command: () => this.schedulePersistState(),
        items: [
          {
            key: 'clients',
            label: 'Клієнти',
            icon: 'pi pi-users',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'leads',
            label: 'Ліди',
            icon: 'pi pi-bolt',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'suppliers',
            label: 'Постачальники',
            icon: 'pi pi-truck',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'quotes',
            label: 'Розрахунки та КП',
            icon: 'pi pi-calculator',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'price-list',
            label: 'Прайс',
            icon: 'pi pi-tags',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'quote-archive',
            label: 'Архів КП',
            icon: 'pi pi-folder',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'tasks',
            label: 'Завдання в роботу',
            icon: 'pi pi-list-check',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'deals',
            label: 'Угоди',
            icon: 'pi pi-file-edit',
            command: () => this.schedulePersistState(),
          },
        ],
      },
      {
        key: 'sewing-shop',
        label: 'Швейний цех',
        icon: 'pi pi-wrench',
        command: () => this.schedulePersistState(),
        items: [
          {
            key: 'schedule',
            label: 'Графік роботи',
            icon: 'pi pi-calendar',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'salary',
            label: 'Зарплата',
            icon: 'pi pi-wallet',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'fabric-stock',
            label: 'Тканина в цеху',
            icon: 'pi pi-box',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'furnitura-stock',
            label: 'Фурнітура в цеху',
            icon: 'pi pi-cog',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'work-time',
            label: 'Робочий час',
            icon: 'pi pi-clock',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'embroidery',
            label: 'Вишивка',
            icon: 'pi pi-sparkles',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'cashbox',
            label: 'Каса цеху',
            icon: 'pi pi-credit-card',
            command: () => this.schedulePersistState(),
          },
        ],
      },
      {
        key: 'accounting',
        label: 'Бухгалтерія',
        icon: 'pi pi-chart-line',
        command: () => this.schedulePersistState(),
        items: [
          {
            key: 'bills',
            label: 'Рахунки',
            icon: 'pi pi-receipt',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'receipts',
            label: 'Надходження',
            icon: 'pi pi-arrow-down-left',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'expenses',
            label: 'Витрати',
            icon: 'pi pi-arrow-up-right',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'reports',
            label: 'Звіти',
            icon: 'pi pi-chart-bar',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'references',
            label: 'Довідники',
            icon: 'pi pi-book',
            command: () => this.schedulePersistState(),
          },
        ],
      },
      {
        key: 'references',
        label: 'Загальні довідники',
        icon: 'pi pi-bookmark',
        command: () => this.schedulePersistState(),
        items: [
          {
            key: 'products',
            label: 'Товари',
            icon: 'pi pi-box',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'fabric-accessories',
            label: 'Тканина та фурнітура',
            icon: 'pi pi-palette',
            routerLink: '/references/garment-accessory',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'garment-part-operations',
            label: 'Операції',
            icon: 'pi pi-cog',
            routerLink: '/references/garment-part-operation',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'suppliers-page',
            label: 'Постачальники',
            icon: 'pi pi-truck',
            routerLink: '/references/supplier',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'calculations',
            label: 'Розрахунки',
            icon: 'pi pi-calculator',
            command: () => this.schedulePersistState(),
          },
          {
            key: 'additional-references',
            label: 'Додаткові довідники',
            icon: 'pi pi-list',
            routerLink: '/references/additional-reference',
            command: () => this.schedulePersistState(),
          },
        ],
      },
      {
        key: 'reports-overview',
        label: 'Загальні звіти',
        icon: 'pi pi-chart-pie',
        command: () => this.schedulePersistState(),
      },
    ];
  }

  private restoreExpandedState(): void {
    const expandedKeys = new Set(this.readState().expandedKeys);

    this.walkMenu(this.menuItems, (item) => {
      const itemKey = item['key'];
      item.expanded = typeof itemKey === 'string' ? expandedKeys.has(itemKey) : false;
    });
  }

  private syncExpandedStateFromRoute(url: string): void {
    const activeBranch = this.findBranchForRoute(this.menuItems, url);

    if (!activeBranch) {
      return;
    }

    activeBranch.forEach((item) => {
      item.expanded = true;
    });
  }

  private findBranchForRoute(
    items: MenuItem[],
    url: string,
    trail: MenuItem[] = [],
  ): MenuItem[] | null {
    for (const item of items) {
      const nextTrail = [...trail, item];

      if (item.routerLink && this.matchesRoute(item.routerLink, url)) {
        return nextTrail;
      }

      if (item.items?.length) {
        const found = this.findBranchForRoute(item.items, url, nextTrail);

        if (found) {
          return found;
        }
      }
    }

    return null;
  }

  private matchesRoute(routerLink: string | string[], url: string): boolean {
    const target = Array.isArray(routerLink) ? routerLink.join('/') : routerLink;

    return url === target || url.startsWith(`${target}/`);
  }

  private persistState(): void {
    const expandedKeys: string[] = [];

    this.walkMenu(this.menuItems, (item) => {
      const itemKey = item['key'];

      if (typeof itemKey === 'string' && item.expanded) {
        expandedKeys.push(itemKey);
      }
    });

    this.storage.setItem(SIDEBAR_STATE_KEY, JSON.stringify({ expandedKeys }));
  }

  private schedulePersistState(): void {
    setTimeout(() => this.persistState(), 0);
  }

  private readState(): SidebarState {
    try {
      const raw = this.storage.getItem(SIDEBAR_STATE_KEY);

      if (!raw) {
        return { expandedKeys: [] };
      }

      const parsed = JSON.parse(raw) as SidebarState;

      return {
        expandedKeys: Array.isArray(parsed?.expandedKeys) ? parsed.expandedKeys : [],
      };
    } catch {
      return { expandedKeys: [] };
    }
  }

  private walkMenu(items: MenuItem[], visitor: (item: MenuItem) => void): void {
    for (const item of items) {
      visitor(item);

      if (item.items?.length) {
        this.walkMenu(item.items, visitor);
      }
    }
  }
}
