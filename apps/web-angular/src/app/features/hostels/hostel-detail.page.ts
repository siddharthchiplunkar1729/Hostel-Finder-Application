import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { ApplicationsService } from '../../core/services/applications.service';
import { AuthService } from '../../core/services/auth.service';
import { HostelBlockDetail, HostelService } from '../../core/services/hostel.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page" *ngIf="hostel; else loadingOrEmpty">
      <section class="hero-card">
        <div class="eyebrow">{{ hostel.type }} residence</div>
        <h1>{{ hostel.blockName }}</h1>
        <p>{{ hostel.description || 'Verified student accommodation with managed occupancy, facilities, and reviews.' }}</p>
        <div class="actions-row">
          <a class="btn ghost" routerLink="/search">Back to search</a>
          <button class="btn" type="button" (click)="apply()" [disabled]="applying || hostel.availableRooms < 1">
            {{ applying ? 'Applying...' : hostel.availableRooms < 1 ? 'Currently full' : 'Apply for this hostel' }}
          </button>
        </div>
        <p class="muted" *ngIf="message">{{ message }}</p>
      </section>

      <div class="detail-layout">
        <div class="stack">
          <img class="listing-image" [src]="hostel.images[0] || fallbackImage" [alt]="hostel.blockName">

          <section class="card">
            <div class="section-header">
              <div>
                <h2>Overview</h2>
                <p class="muted">{{ hostel.location }} - Average rating {{ hostel.averageRating || hostel.rating || '4.5' }}</p>
              </div>
            </div>
            <div class="meta-grid">
              <div class="stat-card">
                <div class="muted">Total rooms</div>
                <strong>{{ hostel.totalRooms }}</strong>
              </div>
              <div class="stat-card">
                <div class="muted">Available</div>
                <strong>{{ hostel.availableRooms }}</strong>
              </div>
              <div class="stat-card">
                <div class="muted">Occupied</div>
                <strong>{{ hostel.occupiedRooms }}</strong>
              </div>
            </div>
          </section>

          <section class="card">
            <h2>Facilities</h2>
            <div class="chip-row">
              <span class="chip" *ngFor="let facility of hostel.facilities">{{ facility }}</span>
            </div>
          </section>

          <section class="card" *ngIf="hostel.rooms?.length">
            <h2>Room map</h2>
            <div class="cards-grid">
              <article class="stat-card" *ngFor="let room of hostel.rooms?.slice(0, 8)">
                <div class="muted">{{ room.roomNumber }}</div>
                <strong>{{ room.status }}</strong>
                <div class="muted">{{ room.occupants }}/{{ room.capacity }} occupants</div>
              </article>
            </div>
          </section>

          <section class="card" *ngIf="hostel.reviews?.length">
            <div class="section-header">
              <div>
                <h2>Resident reviews</h2>
                <p class="muted">{{ hostel.totalReviews || hostel.reviews?.length }} reviews loaded</p>
              </div>
            </div>
            <div class="list">
              <article class="stat-card" *ngFor="let review of hostel.reviews?.slice(0, 4)">
                <strong>{{ review.studentId }}</strong>
                <div class="muted">Rating {{ review.rating }}/5 - Helpful {{ review.helpful }}</div>
                <p>{{ review.reviewText }}</p>
              </article>
            </div>
          </section>
        </div>

        <aside class="stack">
          <section class="card">
            <h3>Warden information</h3>
            <div class="list">
              <div><strong>{{ hostel.wardenInfo.name }}</strong></div>
              <div class="muted">{{ hostel.wardenInfo.phone }}</div>
              <div class="muted" *ngIf="hostel.wardenInfo.email">{{ hostel.wardenInfo.email }}</div>
            </div>
          </section>

          <section class="card">
            <h3>Booking journey</h3>
            <p class="muted">The React flow had booking and fee-payment steps after hostel selection. Those routes are now wired in Angular too.</p>
            <div class="actions-row">
              <a class="btn ghost" routerLink="/booking">Open booking</a>
              <a class="btn ghost" routerLink="/fee-payment">Fee payment</a>
            </div>
          </section>
        </aside>
      </div>
    </div>

    <ng-template #loadingOrEmpty>
      <div class="empty-state">
        {{ loading ? 'Loading hostel details...' : 'The hostel block could not be loaded.' }}
      </div>
    </ng-template>
  `
})
export class HostelDetailPageComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly hostelService = inject(HostelService);
  private readonly applicationsService = inject(ApplicationsService);
  private readonly authService = inject(AuthService);

  readonly fallbackImage = 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80';

  hostel: HostelBlockDetail | null = null;
  loading = true;
  applying = false;
  message = '';

  constructor() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (!id) {
        this.loading = false;
        return;
      }

      this.loading = true;
      this.hostelService.getHostelBlock(id).subscribe({
        next: (data) => {
          this.hostel = data;
          this.loading = false;
        },
        error: () => {
          this.hostel = null;
          this.loading = false;
        }
      });
    });
  }

  apply(): void {
    if (!this.hostel) {
      return;
    }

    const user = this.authService.currentUser();
    if (!user) {
      this.router.navigate(['/auth/login'], { queryParams: { returnUrl: `/hostels/${this.hostel._id}` } });
      return;
    }

    if (user.role !== 'Student') {
      this.message = 'Only students can submit hostel applications.';
      return;
    }

    this.applying = true;
    this.message = '';

    this.applicationsService.apply(this.hostel._id, {
      preferredRoomType: 'Double Share',
      moveInDate: new Date().toISOString()
    }).subscribe({
      next: (response) => {
        this.message = response.message;
        this.applying = false;
      },
      error: (error) => {
        this.message = error.error?.error ?? 'Could not submit the application.';
        this.applying = false;
      }
    });
  }
}
