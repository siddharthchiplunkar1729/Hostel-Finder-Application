import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <section class="card">
      <h2>Reset Password</h2>
      <form [formGroup]="form" (ngSubmit)="submit()">
        <div class="field">
          <label>New Password</label>
          <input formControlName="password" type="password">
        </div>
        <button class="btn" type="submit">Reset password</button>
      </form>
      <p class="muted" *ngIf="message">{{ message }}</p>
    </section>
  `
})
export class ResetPasswordPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);

  readonly form = this.fb.nonNullable.group({
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  message = '';

  submit(): void {
    const token = this.route.snapshot.queryParamMap.get('token') ?? '';
    if (!token || this.form.invalid) {
      this.message = 'A valid token and password are required.';
      return;
    }

    this.authService.resetPassword({
      token,
      password: this.form.getRawValue().password
    }).subscribe({
      next: (response) => {
        this.message = response.message;
      },
      error: (error) => {
        this.message = error.error?.error ?? 'Reset failed';
      }
    });
  }
}
