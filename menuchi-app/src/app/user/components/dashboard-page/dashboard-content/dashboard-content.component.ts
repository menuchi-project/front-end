import { Component, OnInit, OnDestroy } from '@angular/core';
import { Item } from '../../../models/Item';
import { ItemService } from '../../../services/item/item.service';
import { UserService } from '../../../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-dashboard-content',
  standalone: false,
  templateUrl: './dashboard-content.component.html',
  styleUrl: './dashboard-content.component.scss',
})
export class DashboardContentComponent implements OnInit, OnDestroy {
  item!: Item;
  userName: string = '';
  private itemsSubscription!: Subscription;

  constructor(
    private readonly itemService: ItemService,
    private readonly userService: UserService
  ) {}

  ngOnInit() {
    this.userName = this.userService.getUserName();

    this.itemsSubscription = this.itemService.itemsData$.subscribe({
      next: (response: Item[]) => {
        this.item = response[0] || null;
      },
      error: (error) => {
        console.log('error in dashboard, line 22:', error);
      },
    });

    this.itemService.geAllItems();
  }

  ngOnDestroy() {
    if (this.itemsSubscription) {
      this.itemsSubscription.unsubscribe();
    }
  }
}