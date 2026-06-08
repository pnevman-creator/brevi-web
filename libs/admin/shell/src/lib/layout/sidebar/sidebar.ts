import { NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StyleClassModule } from 'primeng/styleclass';

import { SIDEBAR_PANEL_MENU_PT } from './sidebar.panel-menu.pt';

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
  readonly menuItems: MenuItem[] = [
    {
      label: 'Сервіс менеджера',
      icon: 'pi pi-briefcase',
      items: [
        { label: 'Клієнти', icon: 'pi pi-users' },
        { label: 'Ліди', icon: 'pi pi-bolt' },
        { label: 'Постачальники', icon: 'pi pi-truck' },
        { label: 'Прорахунки та КП', icon: 'pi pi-calculator' },
        { label: 'Прайс', icon: 'pi pi-tags' },
        { label: 'Архів КП', icon: 'pi pi-folder' },
        { label: 'Завдання в роботу', icon: 'pi pi-list-check' },
        { label: 'Угоди', icon: 'pi pi-file-edit' },
      ],
    },
    {
      label: 'Швейний цех',
      icon: 'pi pi-wrench',
      items: [
        { label: 'Графік роботи', icon: 'pi pi-calendar' },
        { label: 'Зарплата', icon: 'pi pi-wallet' },
        { label: 'Тканина в цеху', icon: 'pi pi-box' },
        { label: 'Фурнітура в цеху', icon: 'pi pi-cog' },
        { label: 'Робочий час', icon: 'pi pi-clock' },
        { label: 'Вишивка', icon: 'pi pi-sparkles' },
        { label: 'Каса цех', icon: 'pi pi-credit-card' },
      ],
    },
    {
      label: 'Бухгалтерія',
      icon: 'pi pi-chart-line',
      items: [
        { label: 'Рахунки', icon: 'pi pi-receipt' },
        { label: 'Надходження', icon: 'pi pi-arrow-down-left' },
        { label: 'Витрати', icon: 'pi pi-arrow-up-right' },
        { label: 'Звіти', icon: 'pi pi-chart-bar' },
        { label: 'Довідники', icon: 'pi pi-book' },
      ],
    },
    {
      label: 'Загальні довідники',
      icon: 'pi pi-bookmark',
      items: [
        { label: 'Товари', icon: 'pi pi-box' },
        { label: 'Тканина та фурнітура', icon: 'pi pi-palette' },
        { label: 'Прорахунки', icon: 'pi pi-calculator' },
        { label: 'Додаткові довідники', icon: 'pi pi-list' },
      ],
    },
    {
      label: 'Загальні звіти',
      icon: 'pi pi-chart-pie',
    },
  ];

  readonly panelMenuPt = SIDEBAR_PANEL_MENU_PT;
}
