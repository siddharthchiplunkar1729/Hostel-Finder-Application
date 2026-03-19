import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OperationsService } from '../../core/services/operations.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="page">
      <section class="hero-card">
        <div class="eyebrow">🏢 Warden Dashboard</div>
        <h1>Block-Level Operational View</h1>
        <p>Manage resident approvals, track occupancy, and respond to support issues for your assigned hostel block.</p>
        <div class="actions-row">
          <a class="btn ghost" routerLink="/complaints">View Complaints</a>
          <a class="btn ghost" routerLink="/applications">Applications</a>
        </div>
      </section>

      <!-- Loading -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Loading warden data…</p>
      </div>

      <!-- Data view -->
      <section class="grid two" *ngIf="!loading && data">
        <article class="card">
          <h2 style="margin-bottom:16px">Block Overview</h2>
          <div class="list">
            <div class="info-row" *ngIf="data?.blockName">
              <span class="muted">Block</span>
              <strong>{{ data?.blockName }}</strong>
            </div>
            <div class="info-row" *ngIf="data?.totalRooms">
              <span class="muted">Total rooms</span>
              <strong>{{ data?.totalRooms }}</strong>
            </div>
            <div class="info-row" *ngIf="data?.availableRooms != null">
              <span class="muted">Available</span>
              <strong>{{ data?.availableRooms }}</strong>
            </div>
            <div class="info-row" *ngIf="data?.occupancyRate != null">
              <span class="muted">Occupancy</span>
              <span class="status-pill">{{ data?.occupancyRate }}%</span>
            </div>
          </div>
        </article>

        <article class="card">
          <h2 style="margin-bottom:16px">Quick stats</h2>
          <div class="list">
            <div class="info-row" *ngIf="data?.pendingApplications != null">
              <span class="muted">Pending applications</span>
              <span class="badge warn">{{ data?.pendingApplications }}</span>
            </div>
            <div class="info-row" *ngIf="data?.openComplaints != null">
              <span class="muted">Open complaints</span>
              <span class="badge danger">{{ data?.openComplaints }}</span>
            </div>
            <div class="info-row" *ngIf="data?.approvedCount != null">
              <span class="muted">Approved students</span>
              <span class="badge success">{{ data?.approvedCount }}</span>
            </div>
          </div>
        </article>
      </section>

      <!-- Raw fallback when no well-structured fields -->
      <section class="card" *ngIf="!loading && data && !data?.blockName">
        <h2 style="margin-bottom:12px">Warden Response</h2>
        <p class="muted" style="margin-bottom:12px">Raw API response — no block-level fields found in this payload.</p>
        <pre style="background:var(--surface-alt);border-radius:var(--radius-sm);padding:16px;font-size:0.8rem;overflow:auto">{{ data | json }}</pre>
      </section>

      <!-- Empty -->
      <div class="empty-state" *ngIf="!loading && !data">
        <span class="icon">🔐</span>
        <h2 style="font-size:1.1rem;font-weight:800;margin:0 0 8px">No warden data</h2>
        <p>Log in as a Warden to access the operational panel. <a routerLink="/auth/login" style="color:var(--primary);font-weight:700">Sign in →</a></p>
      </div>
    </div>
  `,
  styles: [`
    .info-row {
      display:flex;justify-content:space-between;align-items:center;gap:12px;
      padding:10px 0;border-bottom:1px solid var(--border);
    }
    .info-row:last-child { border-bottom:none;padding-bottom:0; }
    .info-row .muted { font-size:0.875rem; }
    .info-row strong { font-weight:700;font-size:0.9rem; }
  `]
})
export class WardenPageComponent {
  private readonly operationsService = inject(OperationsService);

  data: any = null;
  loading = true;

  constructor() {
    this.operationsService.getWardenDashboard().subscribe({
      next: (v)  => { this.data = v; this.loading = false; },
      error: ()  => { this.data = null; this.loading = false; }
    });
  }
}
