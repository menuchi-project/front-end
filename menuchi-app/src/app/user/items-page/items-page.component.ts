import { Component } from '@angular/core';

@Component({
  selector: 'app-items-page',
  standalone: false,
  templateUrl: './items-page.component.html',
  styleUrl: './items-page.component.scss',
})
export class ItemsPageComponent {
  isCollapsed = false;
}
