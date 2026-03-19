import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AdminHostelSummary, HostelService } from '../../core/services/hostel.service';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="page">
      <!-- Admin header bar -->
      <section class="admin-header-bar">
        <div class="admin-header-bar-left">
          <div class="icon-box" style="width:48px;height:48px;background:rgba(255,255,255,0.15);border-radius:14px;font-size:1.4rem;">🛡️</div>
          <div>
            <h1 style="margin:0;font-size:1.5rem;font-weight:900;letter-spacing:-0.02em">Admin Console</h1>
            <p style="margin:0;font-size:0.72rem;color:rgba(255,255,255,0.6);font-weight:700;text-transform:uppercase;letter-spacing:0.15em">Marketplace Orchestrator</p>
          </div>
        </div>
        <div class="admin-header-bar-right">
          <div style="text-align:right">
            <p style="margin:0;font-size:0.875rem;font-weight:700">University Administrator</p>
            <p style="margin:0;font-size:0.75rem;color:rgba(255,255,255,0.55)">admin&#64;hostelhub.com</p>
          </div>
          <div class="avatar" style="width:48px;height:48px;font-size:1.1rem;border:2px solid rgba(255,255,255,0.25);">A</div>
        </div>
      </section>

      <!-- Stats grid -->
      <section class="stats-grid">
        <article class="stat-card stat-card--accent">
          <div class="stat-card-inner">
            <div>
              <div class="muted">Pending Approvals</div>
              <strong style="color:var(--accent)">{{ pending }}</strong>
            </div>
            <div class="stat-icon" style="background:var(--accent-light);color:var(--accent)">⏳</div>
          </div>
        </article>
        <article class="stat-card stat-card--success">
          <div class="stat-card-inner">
            <div>
              <div class="muted">Approved Hostels</div>
              <strong style="color:var(--success)">{{ approved }}</strong>
            </div>
            <div class="stat-icon" style="background:var(--success-light);color:var(--success)">✅</div>
          </div>
        </article>
        <article class="stat-card stat-card--primary">
          <div class="stat-card-inner">
            <div>
              <div class="muted">Total Listings</div>
              <strong style="color:var(--primary)">{{ hostels.length }}</strong>
            </div>
            <div class="stat-icon" style="background:var(--primary-light);color:var(--primary)">🏢</div>
          </div>
        </article>
      </section>

      <!-- Search + filter bar -->
      <section class="card" style="padding:20px 24px">
        <div style="display:flex;gap:16px;align-items:center;flex-wrap:wrap">
          <div class="search-wrap" style="flex:1;min-width:200px">
            <span class="search-icon">🔍</span>
            <input type="text" [(ngModel)]="searchQuery" placeholder="Search by block name or warden…">
          </div>
          <div class="filter-tabs">
            <button *ngFor="let t of filterOptions"
              class="filter-tab" [class.active]="activeFilter === t"
              (click)="activeFilter = t">{{ t }}</button>
          </div>
        </div>
      </section>

      <!-- Loading -->
      <div class="loading-state" *ngIf="loading">
        <div class="spinner"></div>
        <p>Fetching listing requests…</p>
      </div>

      <!-- Hostel list -->
      <section *ngIf="!loading && filteredHostels.length" class="list">
        <article class="hostel-admin-card" *ngFor="let hostel of filteredHostels">
          <div class="hostel-admin-info">
            <div class="icon-box" style="width:56px;height:56px;background:var(--primary-light);border-radius:var(--radius-sm);font-size:1.5rem">🏢</div>
            <div>
              <h3 style="margin:0 0 4px;font-size:1.1rem;font-weight:800;letter-spacing:-0.02em">{{ hostel.blockName }}</h3>
              <p class="muted" style="margin:0;font-size:0.82rem">{{ hostel.type }} · {{ hostel.location }}</p>
            </div>
          </div>

          <div class="hostel-admin-stats">
            <div class="hostel-stat">
              <div class="muted">Rooms</div>
              <strong>{{ hostel.availableRooms }}<small style="font-weight:600;font-size:0.75rem;color:var(--muted)">/{{ hostel.totalRooms }}</small></strong>
            </div>
            <div class="hostel-stat">
              <div class="muted">Rating</div>
              <strong>⭐ {{ hostel.rating?.toFixed(1) || '4.5' }}</strong>
            </div>
          </div>

          <div class="hostel-admin-warden">
            <div class="avatar" style="width:40px;height:40px;font-size:0.9rem">{{ hostel.wardenInfo.name.charAt(0) }}</div>
            <div>
              <div style="font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em;color:var(--muted)">Warden</div>
              <div style="font-size:0.875rem;font-weight:700">{{ hostel.wardenInfo.name }}</div>
            </div>
          </div>

          <div class="hostel-admin-actions">
            <span class="status-pill" [class.pending]="hostel.approvalStatus !== 'Approved'" [class.rejected]="hostel.approvalStatus === 'Rejected'">
              {{ hostel.approvalStatus }}
            </span>
            <a class="btn sm ghost" [routerLink]="['/hostels', hostel._id]">View</a>
          </div>
        </article>
      </section>

      <!-- Empty state -->
      <div class="empty-state" *ngIf="!loading && !filteredHostels.length">
        <span class="icon">✨</span>
        <h2 style="font-size:1.25rem;font-weight:800;margin:0 0 8px">No listing requests!</h2>
        <p>All clear. New requests will appear here for verification.</p>
      </div>
    </div>
  `,
  styles: [`
    .admin-header-bar {
      display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:16px;
      padding:28px 32px;border-radius:var(--radius-xl);
      background:linear-gradient(135deg,#0c1f6e 0%,#1d4ed8 60%);
      color:white;box-shadow:0 16px 40px rgba(29,78,216,0.3);
    }
    .admin-header-bar-left,.admin-header-bar-right { display:flex;align-items:center;gap:16px; }

    .stat-card-inner { display:flex;justify-content:space-between;align-items:center;gap:12px; }
    .stat-icon { width:52px;height:52px;border-radius:var(--radius-sm);display:flex;align-items:center;justify-content:center;font-size:1.3rem;transition:transform .3s; }
    .stat-card:hover .stat-icon { transform:scale(1.1); }

    .hostel-admin-card {
      background:white;border:1px solid var(--border);border-radius:var(--radius-xl);
      padding:20px 24px;display:flex;align-items:center;flex-wrap:wrap;gap:16px;
      box-shadow:var(--shadow-sm);transition:box-shadow .25s,transform .25s;
    }
    .hostel-admin-card:hover { box-shadow:var(--shadow);transform:translateY(-2px); }
    .hostel-admin-info { display:flex;align-items:center;gap:14px;flex:1;min-width:200px; }
    .hostel-admin-stats { display:flex;gap:24px;padding:0 24px;border-left:1px solid var(--border);border-right:1px solid var(--border); }
    .hostel-stat { text-align:center; }
    .hostel-stat .muted { font-size:0.7rem;font-weight:700;text-transform:uppercase;letter-spacing:0.1em; }
    .hostel-stat strong { font-size:1.1rem;font-weight:900;display:block;margin-top:2px; }
    .hostel-admin-warden { display:flex;align-items:center;gap:10px; }
    .hostel-admin-actions { display:flex;align-items:center;gap:10px;margin-left:auto; }
  `]
})
export class AdminPageComponent {
  private readonly hostelService = inject(HostelService);

  hostels: AdminHostelSummary[] = [];
  loading = true;
  searchQuery = '';
  activeFilter = 'All';
  readonly filterOptions = ['All', 'Pending', 'Approved', 'Rejected'];

  get pending()  { return this.hostels.filter(h => h.approvalStatus === 'Pending').length; }
  get approved() { return this.hostels.filter(h => h.approvalStatus === 'Approved').length; }

  get filteredHostels() {
    return this.hostels.filter(h => {
      const matchFilter = this.activeFilter === 'All' || h.approvalStatus === this.activeFilter;
      const q = this.searchQuery.toLowerCase();
      const matchSearch = !q || h.blockName.toLowerCase().includes(q) || h.wardenInfo.name.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }

  constructor() {
    this.hostelService.getAdminHostels().subscribe({
      next: (data) => { this.hostels = data; this.loading = false; },
      error: ()   => { this.hostels = [];  this.loading = false; }
    });
  }
}
