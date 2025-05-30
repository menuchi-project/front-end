import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../main/services/auth/auth.service';

@Component({
  selector: 'app-otp-verification',
  templateUrl: './otp-email-verification-page.component.html',
  styleUrl: './otp-email-verification-page.component.scss'
})
export class OtpVerificationComponent implements OnInit {
  otpCodeValue: string = '';
  email: string = '';

  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || 'ایمیل شما';
    });
  }

  onSubmit() {
    if (this.otpCodeValue.length === 6) {
      this.authService.checkOtp(this.email, this.otpCodeValue).subscribe(
        response => {
          console.log('OTP verified for email:', this.email);
          this.router.navigate(['/dashboard']);
        },
        error => {
          console.error('OTP verification failed:', error);
          alert('کد اشتباه است یا منقضی شده.');
        }
      );
    } else {
      alert('کد باید 6 رقمی باشد.');
    }
  }

  resendCode() {
    this.authService.sendOtp(this.email).subscribe(
      response => {
        console.log('OTP resent:', response);
        alert('کد جدید به ' + this.email + ' ارسال شد.');
      },
      error => {
        console.error('OTP resend failed:', error);
        alert('خطا در ارسال مجدد کد.');
      }
    );
  }
}