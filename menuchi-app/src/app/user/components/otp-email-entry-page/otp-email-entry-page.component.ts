import { AuthService } from '../../../main/services/auth/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NgOptimizedImage } from '@angular/common'; 
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp-email-entry',
  templateUrl: './otp-email-entry-page.component.html',
  styleUrls: ['./otp-email-entry-page.component.scss'],
  standalone: true,
  imports: [
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    ReactiveFormsModule,
    NgOptimizedImage,
  ],
})
export class OtpEmailEntryComponent implements OnInit {
  validateForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      const email = this.validateForm.value.email;
      this.authService.sendOtp(email).subscribe(
        response => {
          console.log('OTP sent:', response);
          this.router.navigate(['/otp-verification'], { queryParams: { email } });
        },
        error => {
          console.error('OTP send failed:', error);
          alert('خطا در ارسال کد. دوباره تلاش کنید.');
        }
      );
    }
  }
}