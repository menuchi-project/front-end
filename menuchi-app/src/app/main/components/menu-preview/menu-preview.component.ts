import { Component } from '@angular/core';
import { CATEGORIES } from '../../models/CatNameIcons';

@Component({
  selector: 'app-menu-preview',
  standalone: false,
  templateUrl: './menu-preview.component.html',
  styleUrl: './menu-preview.component.scss',
})
export class MenuPreviewComponent {
  items = CATEGORIES;
}
