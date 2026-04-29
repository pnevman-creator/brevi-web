import { Component } from '@angular/core';

import { ProductContent } from '../../sections/product-content/product-content';
import { ProductHeader } from '../../sections/product-header/product-header';

@Component({
  selector: 'lib-product-page',
  imports: [ProductHeader, ProductContent],
  templateUrl: './product.page.html',
  styleUrl: './product.page.scss',
})
export class ProductPage {}
