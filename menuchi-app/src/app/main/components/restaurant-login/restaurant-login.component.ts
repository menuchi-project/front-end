import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';
import { LoginRequest } from '../../models/Auth';
import { AuthService } from '../../services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';
import { UserService } from '../../../user/services/user/user.service';

@Component({
  selector: 'app-restaurant-login',
  standalone: false,
  templateUrl: './restaurant-login.component.html',
  styleUrl: './restaurant-login.component.scss',
})
export class RestaurantLoginComponent {
  private fb = inject(NonNullableFormBuilder);
  validateForm = this.fb.group({
    username: this.fb.control('', [Validators.required]),
    password: this.fb.control('', [Validators.required]),
    remember: this.fb.control(true),
  });

  passwordVisible: boolean = false;
  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly messageService: NzMessageService,
    private readonly router: Router,
  ) {}

  submitForm(): void {
    if (this.validateForm.valid) {
      let request: LoginRequest = {
        password: this.validateForm.value['password']!,
        phoneNumber: this.validateForm.value['username']!,
      };

      this.authService.login(request).subscribe({
        next: (response) => {
          if (response) {
            this.authService.fetchUserProfile().subscribe({
              next: (user) => {
                if (user) {
                  this.messageService.success('شما با موفقیت وارد شدید.');
                  this.router.navigate(['/dashboard']);
                } else {
                  this.messageService.error('مشکلی در دریافت پروفایل پیش آمد!');
                }
              },
              error: () => {
                this.messageService.error('مشکلی در دریافت پروفایل پیش آمد!');
              },
            });
          } else {
            this.messageService.error('خطا در ورود!');
          }
        },
        error: (error) => {
          console.log('خطا در ورود: ', error);
          this.messageService.error('اطلاعات وارد شده صحیح نمی‌باشند.');
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }
}
