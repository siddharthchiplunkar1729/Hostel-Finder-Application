import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>Forgot Password</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label>Email</label>
          <input formControlName="email" type="email">
        </div>
        <button class="btn" type="submit">Send reset link</button>
      </form>
      <p class="muted" *ngIf="message">{{ message }}</p>
    </section>
  `
})
export class ForgotPasswordPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]]
  });

  message = '';

  submit(): void {
    if (this.form.invalid) {
      this.message = 'Enter a valid email.';
      return;
    }

    this.authService.forgotPassword(this.form.getRawValue().email).subscribe({
      next: (response) => {
        this.message = response.devResetUrl
          ? `${response.message} Dev URL: ${response.devResetUrl}`
          : response.message;
      },
      error: (error) => {
        this.message = error.error?.error ?? 'Request failed';
      }
    });
  }
}
