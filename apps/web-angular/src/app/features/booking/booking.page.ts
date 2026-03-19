import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  template: `
    <div class="page">
      <section class="hero-card">
        <div class="eyebrow">Booking flow</div>
        <h1>Confirm a stay and keep the route alive while the migration finishes.</h1>
        <p>
          This route existed in the React app, so the Angular frontend now preserves it with a clean confirmation flow.
        </p>
      </section>

      <section class="grid two" *ngIf="!confirmed; else successState">
        <article class="card">
          <h2>Guest details</h2>
          <form [formGroup]="form" (ngSubmit)="submit()">
            <div class="field">
              <label>Full name</label>
              <input formControlName="name" placeholder="Riya Sharma">
            </div>
            <div class="grid two">
              <div class="field">
                <label>Email</label>
                <input formControlName="email" type="email" placeholder="riya@example.com">
              </div>
              <div class="field">
                <label>Phone</label>
                <input formControlName="phone" placeholder="9876543210">
              </div>
            </div>
            <button class="btn" type="submit">Confirm booking</button>
          </form>
        </article>

        <article class="card">
          <h2>Booking summary</h2>
          <div class="list">
            <div><strong>Hostel:</strong> Demo migration preview</div>
            <div><strong>Stay:</strong> 3 nights</div>
            <div><strong>Total:</strong> INR 2,850</div>
            <div class="muted">This page currently keeps the frontend journey intact while backend booking rules continue to evolve.</div>
          </div>
        </article>
      </section>

      <ng-template #successState>
        <section class="card">
          <h2>Booking confirmed</h2>
          <p class="muted">A confirmation state now exists in Angular, matching the old React route coverage.</p>
          <div class="actions-row">
            <a class="btn" routerLink="/">Back home</a>
            <a class="btn ghost" routerLink="/search">Browse more hostels</a>
          </div>
        </section>
      </ng-template>
    </div>
  `
})
export class BookingPageComponent {
  private readonly fb = inject(FormBuilder);

  confirmed = false;

  readonly form = this.fb.nonNullable.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    phone: ['', Validators.required]
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.confirmed = true;
  }
}
