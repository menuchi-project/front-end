import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../main/services/auth/auth.service';

@Component({
  selector: 'app-otp-email-entry',
  templateUrl: './otp-email-entry-page.component.html',
  styleUrls: ['./otp-email-entry-page.component.scss'],
})
export class OtpEmailEntryComponent {
  emailValue: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (this.emailValue) {
      this.authService.sendOtp(this.emailValue).subscribe(
        response => {
          console.log('OTP sent:', response);
          this.router.navigate(['/otp-verification'], { queryParams: { email: this.emailValue } });
        },
        error => {
          console.error('OTP send failed:', error);
          alert('خطا در ارسال کد. دوباره تلاش کنید.');
        }
      );
    }
  }
}