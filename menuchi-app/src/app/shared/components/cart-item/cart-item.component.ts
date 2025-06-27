// src/app/features/cart/components/cart-item/cart-item.component.ts
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PersianNumberPipe } from '../../pipes/persian-number/persian-number.pipe';
import { Item } from '../../../user/models/Item';

@Component({
  selector: 'app-cart-item',
  standalone: false,
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss'],
})
export class CartItemComponent {
  @Input() item!: Item;
  @Input() quantity: number = 0;
  @Input() index: number = 0;
  @Input() loading: boolean = false; // Add loading input from item-card

  @Output() quantityChange = new EventEmitter<{
    index: number;
    newQuantity: number;
  }>();

  persianNumberPipe = new PersianNumberPipe();

  increaseQuantity() {
    if (this.quantity < 10) {
      this.quantity++;
      this.quantityChange.emit({
        index: this.index,
        newQuantity: this.quantity,
      });
    }
  }

  decreaseQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
      this.quantityChange.emit({
        index: this.index,
        newQuantity: this.quantity,
      });
    }
  }
}
