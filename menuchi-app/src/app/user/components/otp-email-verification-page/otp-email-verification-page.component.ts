import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../main/services/auth/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzFlexModule } from 'ng-zorro-antd/flex';
import { NzButtonModule } from 'ng-zorro-antd/button';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-email-verification-page.component.html',
  styleUrl: './otp-email-verification-page.component.scss',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgOptimizedImage,
    NzInputModule,
    NzFlexModule,
    NzButtonModule
  ]
})
export class OtpVerificationComponent implements OnInit {
  otpCodeValue: string = '';
  email: string = '';
  countdown: number = 120;
  isResendDisabled: boolean = true;
  private countdownInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || 'ایمیل شما';
    });
    this.startCountdown();
  }

  onOtpInputChange(value: string) {
    const numericValue = value.replace(/\D/g, '');
    this.otpCodeValue = numericValue.slice(0, 6);
  }

  isOtpValid(): boolean {
    return /^\d{6}$/.test(this.otpCodeValue);
 }

  startCountdown() {
    this.isResendDisabled = true;
    this.countdown = 120;
    
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        this.isResendDisabled = false;
      }
    }, 1000);
  }

  onSubmit() {
    if (!this.isOtpValid()) {
      alert('لطفاً یک کد ۶ رقمی معتبر وارد کنید.');
      return;
    }

    this.authService.checkOtp(this.email, this.otpCodeValue).subscribe(
      (response) => {
        // this.router.navigate(['/cart']);
      },
      (error) => {
        alert('کد اشتباه است یا منقضی شده.');
      }
    );
  }

  resendCode() {
    if (this.isResendDisabled) return;
    
    this.authService.sendOtp(this.email).subscribe(
      (response) => {
        alert('کد جدید به ' + this.email + ' ارسال شد.');
        this.startCountdown();
      },
      (error) => {
        alert('خطا در ارسال مجدد کد.');
      }
    );
  }

  maskEmail(email: string, visibleChars: number = 4): string {
    if (!email) return '';
    const [username, domain] = email.split('@');
    if (!username || !domain) return email;
    return `${username.slice(0, visibleChars)}${'x'.repeat(Math.max(0, username.length - visibleChars))}@${domain}`;
  }
  
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
}