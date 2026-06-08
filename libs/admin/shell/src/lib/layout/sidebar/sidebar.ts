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
      expanded: true,
      items: [
        { label: 'Клієнти' },
        { label: 'Ліди' },
        { label: 'Постачальники' },
        { label: 'Прорахунки та КП' },
        { label: 'Прайс' },
        { label: 'Архів КП' },
        { label: 'Завдання в роботу' },
        { label: 'Угоди' },
      ],
    },
    {
      label: 'Швейний цех',
      expanded: true,
      items: [
        { label: 'Графік роботи' },
        { label: 'Зарплата' },
        { label: 'Тканина в цеху' },
        { label: 'Фурнітура в цеху' },
        { label: 'Робочий час' },
        { label: 'Вишивка' },
        { label: 'Каса цех' },
      ],
    },
    {
      label: 'Бухгалтерія',
      expanded: true,
      items: [
        { label: 'Рахунки' },
        { label: 'Надходження' },
        { label: 'Витрати' },
        { label: 'Звіти' },
        { label: 'Довідники' },
      ],
    },
    {
      label: 'Загальні довідники',
      expanded: true,
      items: [
        { label: 'Товари' },
        { label: 'Тканина та фурнітура' },
        { label: 'Прорахунки' },
        { label: 'Додаткові довідники' },
      ],
    },
    {
      label: 'Загальні звіти',
    },
  ];

  readonly panelMenuPt = SIDEBAR_PANEL_MENU_PT;
}
