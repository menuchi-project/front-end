import { Component, OnInit } from '@angular/core';
import { Item } from '../../../models/Item';
import { ItemService } from '../../../services/item/item.service';

@Component({
  selector: 'app-dashboard-content',
  standalone: false,
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
})
export class DashboardContentComponent implements OnInit {
  item!: Item;

  constructor(private readonly itemService: ItemService) {
    this.itemService.itemsData$.subscribe({
      next: (response: Item[]) => {
        this.item = response[0];
      },
      error: (error) => {
        console.log('error in dashboard, line 22:', error);
      },
    });

    this.itemService.geAllItems();
  }

  ngOnInit() {
    // this.itemService.itemsData$.subscribe({
    //   next: (response: Item[]) => {
    //     this.item = response[0];
    //   },
    //   error: (error) => {
    //     console.log('error in dashboard, line 22:', error);
    //   },
    // });
  }
}
