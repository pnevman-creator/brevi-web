import { CommonModule, NgOptimizedImage } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { StyleClassModule } from 'primeng/styleclass';

type SidebarMenuItem = {
  label: string;
};

type SidebarMenuSection = {
  title: string;
  items: SidebarMenuItem[];
};

@Component({
  selector: 'lib-sidebar',
  imports: [
    CommonModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    StyleClassModule,
    NgOptimizedImage,
    RouterLink,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  readonly menuSections: SidebarMenuSection[] = [
    {
      title: 'Сервіс менеджера',
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
      title: 'Швейный цех',
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
      title: 'Бухгалтерія',
      items: [
        { label: 'Рахунки' },
        { label: 'Надходження' },
        { label: 'Витрати' },
        { label: 'Звіти' },
        { label: 'Довідники' },
      ],
    },
    {
      title: 'Загальні довідники',
      items: [
        { label: 'Товари' },
        { label: 'Тканина та фурнітура' },
        { label: 'Прорахунки' },
        { label: 'Додаткові довідники' },
      ],
    },
    {
      title: 'Загальні звіти',
      items: [],
    },
  ];
}
