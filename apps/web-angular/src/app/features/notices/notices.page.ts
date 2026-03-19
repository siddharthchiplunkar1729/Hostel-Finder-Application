import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OperationsService } from '../../core/services/operations.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <section class="hero-card">
        <div class="eyebrow">Notice board</div>
        <h1>Official hostel updates in a readable board layout.</h1>
      </section>

      <section class="cards-grid" *ngIf="notices.length; else empty">
        <article class="card" *ngFor="let notice of notices">
          <div class="badge">{{ notice.priority || notice.type || 'General' }}</div>
          <h2>{{ notice.title || 'Hostel notice' }}</h2>
          <p>{{ notice.content || 'Notice details are available in the API response.' }}</p>
          <div class="muted">{{ notice.createdAt | date:'mediumDate' }}</div>
        </article>
      </section>

      <ng-template #empty>
        <div class="empty-state">No notices are currently available.</div>
      </ng-template>
    </div>
  `
})
export class NoticesPageComponent {
  private readonly operationsService = inject(OperationsService);

  notices: any[] = [];

  constructor() {
    this.operationsService.getNotices().subscribe({
      next: (data) => {
        this.notices = data;
      },
      error: () => {
        this.notices = [];
      }
    });
  }
}
