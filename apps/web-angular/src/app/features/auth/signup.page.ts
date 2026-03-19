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
          <h2 style="font-size:2rem;font-weight:900;letter-spacing:-0.04em;margin:0 0 12px">Join HostelHub</h2>
          <p style="color:rgba(255,255,255,0.75);font-size:1rem;font-weight:500;line-height:1.6;margin:0 0 36px">
            Register as a student and kick-start your hostel admission journey in minutes.
          </p>
          <div style="display:flex;flex-direction:column;gap:12px;font-size:0.875rem;color:rgba(255,255,255,0.65)">
            <div>🏠 Access 2,400+ verified hostels</div>
            <div>📋 Apply in one digital step</div>
            <div>📊 Track status in real time</div>
          </div>
        </div>

        <!-- Right panel (form) -->
        <div class="auth-panel auth-panel--right">
          <h1 style="font-size:1.5rem;font-weight:900;letter-spacing:-0.03em;margin:0 0 8px">Create Account</h1>
          <p class="muted" style="margin:0 0 28px">Already have an account? <a routerLink="/auth/login" style="color:var(--primary);font-weight:700">Sign in →</a></p>

          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="grid two" style="gap:12px">
              <div class="field">
                <label>Full Name</label>
                <input formControlName="name" placeholder="Riya Sharma">
              </div>
              <div class="field">
                <label>Email address</label>
                <input formControlName="email" type="email" placeholder="riya@university.edu">
              </div>
              <div class="field">
                <label>Phone number</label>
                <input formControlName="phone" placeholder="+91 98765 43210">
              </div>
              <div class="field">
                <label>Password</label>
                <input formControlName="password" type="password" placeholder="Min. 8 characters">
              </div>
            </div>
            <button class="btn" type="submit" style="width:100%;padding:14px;margin-top:8px">Create Account</button>
          </form>

          <div *ngIf="message" class="auth-message" [class.auth-message--error]="isError">{{ message }}</div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-page { display:flex;align-items:center;justify-content:center;min-height:70vh;padding:16px; }
    .auth-card {
      display:grid;grid-template-columns:1fr 1fr;max-width:900px;width:100%;
      border-radius:var(--radius-2xl);overflow:hidden;box-shadow:var(--shadow-xl);
    }
    .auth-panel { padding:44px 40px; }
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
      .grid.two { grid-template-columns:1fr; }
    }
  `]
})
export class SignupPageComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly form = this.fb.nonNullable.group({
    name:     ['', Validators.required],
    email:    ['', [Validators.required, Validators.email]],
    phone:    ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]]
  });

  message = '';
  isError = false;

  submit(): void {
    if (this.form.invalid) {
      this.message = 'Please complete all required fields.';
      this.isError = true;
      return;
    }
    this.authService.signup({ ...this.form.getRawValue(), role: 'Student' }).subscribe({
      next: (response) => {
        this.message = response.message;
        this.isError = false;
        this.router.navigateByUrl('/dashboard');
      },
      error: (error) => {
        this.message = error.error?.error ?? 'Signup failed. Please try again.';
        this.isError = true;
      }
    });
  }
}
