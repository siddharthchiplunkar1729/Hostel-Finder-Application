import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OperationsService } from '../../core/services/operations.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <section class="hero-card">
        <div class="eyebrow">Communities</div>
        <h1>Explore resident groups and hostel communities.</h1>
      </section>

      <section class="cards-grid" *ngIf="communities.length; else empty">
        <article class="card" *ngFor="let community of communities">
          <h2>{{ community.name || community.title || 'Community group' }}</h2>
          <p>{{ community.description || community.content || 'Community details are available from the backend.' }}</p>
        </article>
      </section>

      <ng-template #empty>
        <div class="empty-state">No communities are available right now.</div>
      </ng-template>
    </div>
  `
})
export class CommunitiesPageComponent {
  private readonly operationsService = inject(OperationsService);

  communities: any[] = [];

  constructor() {
    this.operationsService.getCommunities().subscribe({
      next: (data) => {
        this.communities = data;
      },
      error: () => {
        this.communities = [];
      }
    });
  }
}
