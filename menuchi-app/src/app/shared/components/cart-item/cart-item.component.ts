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
  @Input() loading: boolean = false; // Add loading input from item-card

  @Output() quantityChange = new EventEmitter<{
    item: Item;
    newQuantity: number;
  }>();

  persianNumberPipe = new PersianNumberPipe();

  increaseQuantity() {
    this.quantityChange.emit({
      item: this.item,
      newQuantity: this.quantity + 1,
    });
  }

  decreaseQuantity() {
    this.quantityChange.emit({
      item: this.item,
      newQuantity: this.quantity - 1,
    });
  }
}
