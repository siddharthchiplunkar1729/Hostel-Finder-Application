import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { AuthService, AuthUser } from './core/services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="app-shell">
      <header class="topbar">
        <div class="topbar-inner">
          <!-- Brand -->
          <a class="brand" routerLink="/">
            <span class="brand-mark">HH</span>
            <span>
              <strong>HostelHub</strong>
              <small>Angular + Spring</small>
            </span>
          </a>

          <!-- Nav -->
          <nav class="pill-nav">
            <a routerLink="/"          routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">Home</a>
            <a routerLink="/search"    routerLinkActive="active">Search</a>
            <a routerLink="/dashboard" routerLinkActive="active" *ngIf="isStudent">Dashboard</a>
            <a routerLink="/applications" routerLinkActive="active" *ngIf="isStudent">Applications</a>
            <a routerLink="/notices"   routerLinkActive="active" *ngIf="isStudent">Notices</a>
            <a routerLink="/mess-menu" routerLinkActive="active" *ngIf="isStudent">Mess Menu</a>
            <a routerLink="/communities" routerLinkActive="active">Communities</a>
            <a routerLink="/warden"    routerLinkActive="active" *ngIf="isWarden">Warden Panel</a>
            <a routerLink="/admin"     routerLinkActive="active" *ngIf="isAdmin">Admin</a>
          </nav>

          <!-- Auth actions -->
          <div class="topbar-actions" *ngIf="user; else guestActions">
            <a class="btn ghost" routerLink="/profile">{{ user.name?.split(' ')[0] || 'Profile' }}</a>
            <button class="btn" type="button" (click)="logout()">Logout</button>
          </div>

          <ng-template #guestActions>
            <div class="topbar-actions">
              <a class="btn ghost" routerLink="/auth/signup">Create account</a>
              <a class="btn"       routerLink="/auth/login">Login</a>
            </div>
          </ng-template>
        </div>
      </header>

      <main class="shell">
        <router-outlet></router-outlet>
      </main>

      <footer class="app-footer">
        <div class="footer-inner">
          <div class="footer-brand">
            <strong>HostelHub</strong>
            <p>Modern student housing, rebuilt on Angular &amp; Spring Boot.</p>
          </div>
          <nav class="footer-links">
            <a routerLink="/search">Browse hostels</a>
            <a routerLink="/stories">Stories</a>
            <a routerLink="/communities">Communities</a>
            <a routerLink="/warden">Warden panel</a>
            <a routerLink="/admin">Admin</a>
          </nav>
        </div>
      </footer>
    </div>
  `
})
export class AppComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  user: AuthUser | null = this.authService.currentUser();

  get isStudent() { return this.user?.role === 'Student'; }
  get isWarden()  { return this.user?.role === 'Warden'; }
  get isAdmin()   { return this.user?.role === 'Admin'; }

  constructor() {
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe(() => {
        this.user = this.authService.currentUser();
      });
  }

  logout(): void {
    this.authService.logout();
    this.user = null;
    this.router.navigateByUrl('/');
  }
}
