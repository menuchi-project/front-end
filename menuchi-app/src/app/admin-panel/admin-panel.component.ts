import { Component } from '@angular/core';
import { MatButton, MatIconButton } from '@angular/material/button';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import {
  MatSidenav,
  MatSidenavContainer,
  MatSidenavContent,
} from '@angular/material/sidenav';
import { RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbar } from '@angular/material/toolbar';
import { NgIf } from '@angular/common';
import {
  MatFormField,
  MatFormFieldModule,
  MatHint,
  MatLabel,
  MatSuffix,
} from '@angular/material/form-field';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  MatCell,
  MatColumnDef,
  MatHeaderCell,
  MatHeaderRow,
  MatRow,
  MatTableModule,
} from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckbox } from '@angular/material/checkbox';
import { ItemsPageComponent } from '../items-page/items-page.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButton,
    MatDivider,
    MatIcon,
    RouterOutlet,
    MatSidenavContainer,
    MatSidenavContent,
    MatSidenav,
    MatIcon,
    MatToolbar,
    MatDivider,
    MatButton,
    RouterLink,
    MatIconButton,
    NgIf,
    MatFormField,
    MatInput,
    MatHint,
    MatLabel,
    MatSuffix,
    MatPaginator,
    MatHeaderRow,
    MatColumnDef,
    MatHeaderCell,
    MatCell,
    MatRow,
    MatCheckbox,
    ItemsPageComponent,
  ],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.scss',
})
export class AdminPanelComponent {}
