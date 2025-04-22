import { Component, OnInit } from '@angular/core';
import { DrawerService } from '../../../services/drawer/drawer.service';

@Component({
  selector: 'app-select-items-drawer',
  standalone: false,
  templateUrl: './select-items-drawer.component.html',
  styleUrl: './select-items-drawer.component.scss',
})
export class SelectItemsDrawerComponent implements OnInit {
  isVisible: boolean = false;

  constructor(private readonly drawerService: DrawerService) {}

  ngOnInit(): void {
    this.drawerService.drawerOpens$.subscribe({
      next: (isOpen) => {
        this.isVisible = isOpen;
      },
      error: (error) =>
        console.error('Drawer error in select item drawer, line 64:', error),
    });
  }
}
