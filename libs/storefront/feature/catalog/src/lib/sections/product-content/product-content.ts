import { Component } from '@angular/core';

import { ProductOverview } from '../product-overview/product-overview';
import { ProductTabs } from '../product-tabs/product-tabs';

@Component({
  selector: 'lib-product-content',
  imports: [ProductOverview, ProductTabs],
  templateUrl: './product-content.html',
  styleUrl: './product-content.scss',
})
export class ProductContent {}
