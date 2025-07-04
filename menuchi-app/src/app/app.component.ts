import { Component, OnInit } from '@angular/core';
import { AuthService } from './main/services/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: false,
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  title = 'menuchi-app';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.authService.fetchUserProfile();
  }
}
