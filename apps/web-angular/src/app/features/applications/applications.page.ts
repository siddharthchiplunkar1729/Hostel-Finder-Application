import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ApplicationSummary, ApplicationsService } from '../../core/services/applications.service';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <section class="hero-card">
        <div class="eyebrow">Applications</div>
        <h1>Track each hostel application from submission to review.</h1>
        <p>This page replaces the raw JSON placeholder with a status-oriented layout.</p>
      </section>

      <section class="list" *ngIf="applications.length; else empty">
        <article class="card" *ngFor="let application of applications">
          <div class="section-header">
            <div>
              <h2>{{ application.hostelBlockId.blockName }}</h2>
              <p class="muted">{{ application.hostelBlockId.location }} · {{ application.hostelBlockId.type }}</p>
            </div>
            <span class="status-pill" [class.pending]="application.status !== 'Accepted'">{{ application.status }}</span>
          </div>
          <div class="actions-row">
            <a class="btn ghost" [routerLink]="['/hostels', application.hostelBlockId._id]">Open listing</a>
            <a class="btn ghost" routerLink="/dashboard/reviews">Review status</a>
          </div>
        </article>
      </section>

      <ng-template #empty>
        <div class="empty-state">No applications have been created for this account yet.</div>
      </ng-template>
    </div>
  `
})
export class ApplicationsPageComponent {
  private readonly applicationsService = inject(ApplicationsService);

  applications: ApplicationSummary[] = [];

  constructor() {
    this.applicationsService.getMyApplications().subscribe({
      next: (data) => {
        this.applications = data;
      },
      error: () => {
        this.applications = [];
      }
    });
  }
}
