import { Component, inject, OnDestroy } from '@angular/core';
import { NonNullableFormBuilder, Validators } from '@angular/forms';

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
}
