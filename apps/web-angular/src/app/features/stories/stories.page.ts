import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { OperationsService } from '../../core/services/operations.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <section class="hero-card">
        <div class="eyebrow">Stories</div>
        <h1>Community stories and resident highlights.</h1>
      </section>

      <section class="cards-grid" *ngIf="stories.length; else empty">
        <article class="card" *ngFor="let story of stories">
          <div class="badge">{{ story.category || 'Story' }}</div>
          <h2>{{ story.title || story.name || 'Resident highlight' }}</h2>
          <p>{{ story.content || story.description || 'Story details are available from the backend response.' }}</p>
        </article>
      </section>

      <ng-template #empty>
        <div class="empty-state">No stories are currently available.</div>
      </ng-template>
    </div>
  `
})
export class StoriesPageComponent {
  private readonly operationsService = inject(OperationsService);

  stories: any[] = [];

  constructor() {
    this.operationsService.getStories().subscribe({
      next: (data) => {
        this.stories = data;
      },
      error: () => {
        this.stories = [];
      }
    });
  }
}
