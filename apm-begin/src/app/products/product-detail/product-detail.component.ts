import { Component, Input, OnChanges, OnDestroy, SimpleChanges, inject } from '@angular/core';

import { NgIf, NgFor, CurrencyPipe } from '@angular/common';
import { Product } from '../product';
import { EMPTY, Subscriber, Subscription, catchError } from 'rxjs';
import { ProductService } from '../product.service';

@Component({
    selector: 'pm-product-detail',
    templateUrl: './product-detail.component.html',
    standalone: true,
    imports: [NgIf, NgFor, CurrencyPipe]
})
export class ProductDetailComponent implements OnChanges, OnDestroy{
  @Input() productId: number = 0;
  errorMessage = '';
  subscription!: Subscription

  private productService = inject(ProductService);

  // Product to display
  product: Product | null = null;

  // Set the page title
  pageTitle = this.product ? `Product Detail for: ${this.product.productName}` : 'Product Detail';

  ngOnChanges(changes: SimpleChanges): void {
      const id = changes['productId'].currentValue;
      if (id) {
        this.subscription = this.productService.getProduct(id)
          .pipe(
            catchError(e => {
              this.errorMessage = e;
              return EMPTY;
            })
          ).subscribe(product => {
            this.product = product;
          });
      }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  addToCart(product: Product) {
  }
}
