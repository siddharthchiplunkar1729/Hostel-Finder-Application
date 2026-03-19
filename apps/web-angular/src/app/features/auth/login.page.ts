import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="auth-page">
      <div class="auth-card">
        <!-- Left panel -->
        <div class="auth-panel auth-panel--left">
          <div class="brand-mark" style="width:52px;height:52px;font-size:1.3rem;border-radius:16px;margin-bottom:28px">HH</div>
          <h2 style="font-size:2rem;font-weight:900;letter-spacing:-0.04em;margin:0 0 12px">Welcome back</h2>
          <p style="color:rgba(255,255,255,0.75);font-size:1rem;font-weight:500;line-height:1.6;margin:0 0 36px">
            Sign in to continue with hostel applications and your student dashboard.
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;font-size:0.875rem;color:rgba(255,255,255,0.65)">
            <div>🔒 Secure and encrypted login</div>
            <div>⚡ Instant dashboard access</div>
            <div>🏠 Track your applications</div>
          </div>
        </div>

        <!-- Right panel (form) -->
        <div class="auth-panel auth-panel--right">
          <h1 style="font-size:1.5rem;font-weight:900;letter-spacing:-0.03em;margin:0 0 8px">Login</h1>
          <p class="muted" style="margin:0 0 28px">Don't have an account? <a routerLink="/auth/signup" style="color:var(--primary);font-weight:700">Create one →</a></p>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field">
              <label>Email address</label>
              <input formControlName="email" type="email" placeholder="student@university.edu">
            </div>
            <div class="field">
              <label>Password</label>
              <input formControlName="password" type="password" placeholder="••••••••">
            </div>

            <div style="display:flex;justify-content:flex-end;margin-bottom:20px">
              <a routerLink="/auth/forgot-password" style="color:var(--primary);font-size:0.875rem;font-weight:600">Forgot password?</a>
            </div>

            <button class="btn" type="submit" style="width:100%;padding:14px">Sign In</button>
          </form>

          <div *ngIf="message" class="auth-message" [class.auth-message--error]="isError">{{ message }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display:flex;align-items:center;justify-content:center;min-height:70vh;padding:16px; }
    .auth-card {
      display:grid;grid-template-columns:1fr 1fr;max-width:860px;width:100%;
      border-radius:var(--radius-2xl);overflow:hidden;box-shadow:var(--shadow-xl);
    }
    .auth-panel { padding:48px 44px; }
    .auth-panel--left {
      background:linear-gradient(135deg,#0c1f6e 0%,#1d4ed8 55%,#0c856f 100%);
      color:white;display:flex;flex-direction:column;
    }
    .auth-panel--right { background:white;display:flex;flex-direction:column;justify-content:center; }

    .auth-message {
      margin-top:16px;padding:12px 16px;border-radius:var(--radius-sm);
      font-size:0.875rem;font-weight:600;background:var(--success-light);color:var(--success);
    }
    .auth-message--error { background:var(--danger-light);color:var(--danger); }

    @media(max-width:640px){
      .auth-card { grid-template-columns:1fr; }
      .auth-panel--left { display:none; }
    }
  `]
})
export class LoginPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });

  message = '';
  isError = false;

  submit(): void {
    if (this.form.invalid) {
      this.message = 'Please enter valid credentials.';
      this.isError = true;
      return;
    }
    this.authService.login(this.form.getRawValue()).subscribe({
      next: (response) => {
        this.message = response.message;
        this.isError = false;
        const role = response.user?.role;
        const target = role === 'Admin' ? '/admin' : role === 'Warden' ? '/warden' : '/dashboard';
        this.router.navigateByUrl(target);
      },
      error: (error) => {
        this.message = error.error?.error ?? 'Login failed. Please try again.';
        this.isError = true;
      }
    });
  }
}
