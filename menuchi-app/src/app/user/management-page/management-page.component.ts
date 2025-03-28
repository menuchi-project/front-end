import { Component } from '@angular/core';

@Component({
  selector: 'app-management-page',
  standalone: false,
  templateUrl: './management-page.component.html',
  styleUrl: './management-page.component.scss',
})
export class ManagementPageComponent {
  isCollapsed = false;
}
