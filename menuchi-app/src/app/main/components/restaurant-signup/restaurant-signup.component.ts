import {Component, inject, OnDestroy, OnInit} from '@angular/core';
import {AbstractControl, NonNullableFormBuilder, ValidationErrors, Validators,} from '@angular/forms';
import {Subject, takeUntil} from 'rxjs';
import {SignupRequest, SignupResponse} from '../../models/Auth';
import {AuthService} from '../../services/auth/auth.service';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {ErrorMappingService} from '../../services/error-mapping/error-mapping.service';

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
      username: this.fb.control('', [
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
    private errorMapper: ErrorMappingService
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
        username: this.validateForm.controls.username.value,
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
        error: (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.status === 409 || err.status === 422) {
            const friendlyMessage = this.errorMapper.getFriendlyMessage(err.error);
            this.message.error(friendlyMessage);
          }
          console.log('خطا :', err);
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
