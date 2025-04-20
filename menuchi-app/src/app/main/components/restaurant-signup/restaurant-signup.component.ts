import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { SignupRequest, SignupResponse } from '../../models/Auth';
import { AuthService } from '../../services/auth/auth.service';

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
  successMessage: string | null = null;
  errorMessage: string | null = null;

  validateForm = this.fb.group(
    {
      phoneNumber: this.fb.control('', [
        Validators.required,
        Validators.pattern(/^9\d{9}$/),
      ]),
      password: this.fb.control('', [
        Validators.pattern(
          '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,64}$',
        ),
      ]),
      repeatPassword: this.fb.control('', [Validators.required]),
      nickname: this.fb.control('', [
        Validators.required,
        Validators.minLength(3),
      ]),
      email: this.fb.control('', [Validators.required, Validators.email]),
      agreeToRules: this.fb.control(false, [Validators.requiredTrue]),
    },
    {
      validators: this.passwordsMatchValidator,
    },
  );

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateForm.controls.repeatPassword.updateValueAndValidity();
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
          this.successMessage = 'ثبت نام با موفقیت انجام شد!';
          this.errorMessage = null;
          console.log('Signup Response:', response);
        },
        error: (error) => {
          this.isLoading = false;
          this.errorMessage = 'مشکلی در ثبت نام پیش آمد!';
          this.successMessage = null;
          console.log('Signup Error:', error);
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

  passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const repeatPassword = group.get('repeatPassword')?.value;

    return password === repeatPassword ? null : { passwordMismatch: true };
  }
}
