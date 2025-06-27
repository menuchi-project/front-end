import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, NonNullableFormBuilder, ValidationErrors, Validators,} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {SignupRequest, SignupResponse} from '../../models/Auth';
import {AuthService} from '../../services/auth/auth.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Router} from '@angular/router';

@Component({
  selector: 'app-restaurant-signup',
  standalone: false,
  templateUrl: './restaurant-signup.component.html',
  styleUrls: ['./restaurant-signup.component.scss'],
})
export class RestaurantSignupComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  isLoading = false;

  validateForm = this.fb.group(
    {
      phoneNumber: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^09\d{9}$/),
      ]),
      password: this.fb.control('', [
        Validators.required,
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$',
        ),
      ]),
      repeatPassword: this.fb.control('', [Validators.required]),
      nickname: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern('^[a-zA-Z0-9_-]{3,30}$'),
      ]),
      email: this.fb.control('', [Validators.required, Validators.email]),
    },
    {
      validators: this.passwordsMatchValidator,
    },
  );

  passwordVisible: boolean = false;

  togglePasswordVisibility(): void {
    this.passwordVisible = !this.passwordVisible;
  }

  repeatPasswordVisible: boolean = false;

  toggleRepeatPasswordVisibility(): void {
    this.repeatPasswordVisible = !this.repeatPasswordVisible;
  }

  constructor(
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router,
  ) {
  }

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        if (this.validateForm.controls.repeatPassword.value) {
          this.validateForm.controls.repeatPassword.updateValueAndValidity();
        }
      });

    this.validateForm.controls.repeatPassword.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.isLoading = true;
      const signupData: SignupRequest = {
        phoneNumber: this.validateForm.controls.phoneNumber.value,
        password: this.validateForm.controls.password.value,
        username: this.validateForm.controls.nickname.value,
        email: this.validateForm.controls.email.value,
      };

      this.authService.signup(signupData).subscribe({
        next: (response: SignupResponse) => {
          this.isLoading = false;
          this.message.success(' ثبت نام با موفقیت انجام شد!');
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1000);
        },
        error: (error) => {
          this.isLoading = false;
          if (error.status === 409) {
            this.message.error(' این شماره تلفن یا ایمیل قبلاً ثبت شده است!');
          } else if (error.status === 422) {
            this.message.error(' اطلاعات وارد شده صحیح نمی‌باشند.');
            if (error.error && error.error.details) {
              error.error.details.forEach((detail: any) => {
                this.message.error(' خطا در ثبت‌نام: ' + detail.message);
              });
            }
          } else {
            this.message.error(
              ' مشکلی در ثبت نام پیش آمد! لطفاً دوباره تلاش کنید.',
            );
          }
          console.log('خطا :', error);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({onlySelf: true});
        }
      });
      this.message.error(' لطفاً فرم را به درستی پر کنید!');
    }
  }

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password');
    const repeatPassword = group.get('repeatPassword');

    if (password && repeatPassword && password.value !== repeatPassword.value) {
      repeatPassword.setErrors({passwordMismatch: true});
      return {passwordMismatch: true};
    } else if (repeatPassword && repeatPassword.hasError('passwordMismatch')) {
      repeatPassword.setErrors(null);
    }
    return null;
  }
}
