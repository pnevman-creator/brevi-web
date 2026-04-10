import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Footer, Header } from '@storefront/shell';
import { Toast } from 'primeng/toast';

import { SeoHreflangService } from './seo/seo-hreflang.service';

@Component({
  imports: [RouterModule, Toast, Footer, Header],
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly seoHreflangService = inject(SeoHreflangService);
  protected title = 'storefront';

  constructor() {
    void this.seoHreflangService;
  }
}
