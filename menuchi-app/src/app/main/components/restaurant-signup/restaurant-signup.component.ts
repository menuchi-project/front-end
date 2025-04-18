import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  NonNullableFormBuilder,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-restaurant-signup',
  standalone: false,
  templateUrl: './restaurant-signup.component.html',
  styleUrl: './restaurant-signup.component.scss',
})
export class RestaurantSignupComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  private destroy$ = new Subject<void>();
  validateForm = this.fb.group({
    email: this.fb.control('', [Validators.email, Validators.required]),
    password: this.fb.control('', [Validators.required]),
    checkPassword: this.fb.control('', [
      Validators.required,
      this.confirmationValidator,
    ]),
    nickname: this.fb.control('', [Validators.required]),
    phoneNumber: this.fb.control('', [Validators.required]),
    agree: this.fb.control(false),
  });

  ngOnInit(): void {
    this.validateForm.controls.password.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.validateForm.controls.checkPassword.updateValueAndValidity();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  confirmationValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.validateForm.controls.password.value) {
      return { confirm: true, error: true };
    }
    return {};
  }
}
