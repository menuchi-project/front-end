import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../main/services/auth/auth.service';
import { NgForm, FormsModule } from '@angular/forms';
import { NgOptimizedImage, CommonModule } from '@angular/common';
import { NzInputOtpComponent } from 'ng-zorro-antd/input';
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
    NzInputOtpComponent,
    NzFlexModule,
    NzButtonModule
]
})
export class OtpVerificationComponent implements OnInit {
  otpCodeValue: string = '';
  email: string = '';
  formatter = (value: string): string => value.toUpperCase();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || 'ایمیل شما';
    });
  }

  onSubmit() {
    if (this.otpCodeValue.length === 6) {
      this.authService.checkOtp(this.email, this.otpCodeValue).subscribe(
        response => {
          this.router.navigate(['/dashboard']);
        },
        error => {
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
        alert('کد جدید به ' + this.email + ' ارسال شد.');
      },
      error => {
        alert('خطا در ارسال مجدد کد.');
      }
    );
  }
}
