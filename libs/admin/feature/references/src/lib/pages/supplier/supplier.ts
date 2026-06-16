import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';

import { SupplierPageStore } from './supplier-page.store';

@Component({
  selector: 'lib-supplier',
  imports: [ButtonModule, FormsModule, InputTextModule, TableModule, ToastModule],
  templateUrl: './supplier.html',
  styleUrl: './supplier.css',
  providers: [SupplierPageStore, MessageService],
})
export class Supplier {
  protected readonly store = inject(SupplierPageStore);
}
