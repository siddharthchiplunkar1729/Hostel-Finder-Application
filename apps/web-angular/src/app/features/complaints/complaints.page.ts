import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OperationsService } from '../../core/services/operations.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <section class="hero-card">
        <div class="eyebrow">📋 Complaints</div>
        <h1>Resident Issues &amp; Tickets</h1>
        <p>Track the status of all support tickets raised for your hostel block.</p>
      </section>

      <!-- Loading -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading complaints…</p>
      </div>

      <!-- List -->
      <section class="list" *ngIf="!loading && complaints.length">
        <article class="card complaint-card" *ngFor="let c of complaints">
          <div class="section-header">
            <div>
              <h2 style="font-size:1rem">{{ c.title || 'Complaint record' }}</h2>
              <p class="muted" style="margin:0">{{ c.createdAt | date:'mediumDate' }}</p>
            </div>
            <span class="status-pill"
              [class.pending]="c.status !== 'Resolved' && c.status !== 'Rejected'"
              [class.rejected]="c.status === 'Rejected'">
              {{ c.status || 'Open' }}
            </span>
          </div>
          <p style="margin:12px 0 0;font-size:0.9rem;line-height:1.55">
            {{ c.description || c.category || 'No additional details provided.' }}
          </p>
          <div *ngIf="c.category" style="margin-top:10px">
            <span class="badge">{{ c.category }}</span>
          </div>
        </article>
      </section>

      <!-- Empty -->
      <div class="empty-state" *ngIf="!loading && !complaints.length">
        <span class="icon">🎉</span>
        <h2 style="font-size:1.1rem;font-weight:800;margin:0 0 8px">No complaints!</h2>
        <p>All clear. Log in as a student to view your tickets.</p>
      </div>
    </div>
  `,
  styles: [`
    .complaint-card { transition:box-shadow .25s,transform .25s; }
    .complaint-card:hover { box-shadow:var(--shadow);transform:translateY(-2px); }
  `]
})
export class ComplaintsPageComponent {
  private readonly operationsService = inject(OperationsService);

  complaints: any[] = [];
  loading = true;

  constructor() {
    this.operationsService.getComplaints().subscribe({
      next: (data) => { this.complaints = data; this.loading = false; },
      error: ()    => { this.complaints = [];  this.loading = false; }
    });
  }
}
