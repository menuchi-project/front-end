import { Component, Input } from '@angular/core';
import { Item } from '../../../user/models/Item';

@Component({
  selector: 'app-item-card',
  standalone: false,
  templateUrl: './item-card.component.html',
  styleUrl: './item-card.component.scss',
})
export class ItemCardComponent {
  @Input() data!: Item;
  loading = false;
}
