import { Routes } from '@angular/router';
import { HomePageComponent } from './features/home/home.page';
import { LoginPageComponent } from './features/auth/login.page';
import { SignupPageComponent } from './features/auth/signup.page';
import { ForgotPasswordPageComponent } from './features/auth/forgot-password.page';
import { ResetPasswordPageComponent } from './features/auth/reset-password.page';
import { HostelListPageComponent } from './features/hostels/hostel-list.page';
import { HostelDetailPageComponent } from './features/hostels/hostel-detail.page';
import { DashboardPageComponent } from './features/dashboard/dashboard.page';
import { DashboardReviewsPageComponent } from './features/dashboard/dashboard-reviews.page';
import { AdminPageComponent } from './features/admin/admin.page';
import { StudentsPageComponent } from './features/students/students.page';
import { ApplicationsPageComponent } from './features/applications/applications.page';
import { ComplaintsPageComponent } from './features/complaints/complaints.page';
import { NoticesPageComponent } from './features/notices/notices.page';
import { MessMenuPageComponent } from './features/mess-menu/mess-menu.page';
import { WardenPageComponent } from './features/warden/warden.page';
import { StoriesPageComponent } from './features/stories/stories.page';
import { CommunitiesPageComponent } from './features/communities/communities.page';
import { ProfilePageComponent } from './features/profile/profile.page';
import { BookingPageComponent } from './features/booking/booking.page';
import { FeePaymentPageComponent } from './features/fee-payment/fee-payment.page';

export const routes: Routes = [
  // ── Landing ──
  { path: '', component: HomePageComponent },

  // ── Auth ──
  { path: 'auth/login',            component: LoginPageComponent },
  { path: 'auth/signup',           component: SignupPageComponent },
  { path: 'auth/forgot-password',  component: ForgotPasswordPageComponent },
  { path: 'auth/reset-password',   component: ResetPasswordPageComponent },

  // ── Marketplace ──
  { path: 'search',       component: HostelListPageComponent },
  { path: 'hostels',      component: HostelListPageComponent },
  { path: 'hostels/:id',  component: HostelDetailPageComponent },

  // ── Booking & Payment ──
  { path: 'booking',      component: BookingPageComponent },
  { path: 'fee-payment',  component: FeePaymentPageComponent },

  // ── Student Dashboard (nested pages) ──
  { path: 'dashboard',              component: DashboardPageComponent },
  { path: 'dashboard/profile',      component: ProfilePageComponent },
  { path: 'dashboard/notices',      component: NoticesPageComponent },
  { path: 'dashboard/mess-menu',    component: MessMenuPageComponent },
  { path: 'dashboard/reviews',      component: DashboardReviewsPageComponent },

  // ── Student tools (top-level, mirroring React) ──
  { path: 'applications', component: ApplicationsPageComponent },
  { path: 'complaints',   component: ComplaintsPageComponent },
  { path: 'notices',      component: NoticesPageComponent },
  { path: 'mess-menu',    component: MessMenuPageComponent },
  { path: 'profile',      component: ProfilePageComponent },
  { path: 'students',     component: StudentsPageComponent },

  // ── Staff panels ──
  { path: 'warden',  component: WardenPageComponent },
  { path: 'admin',   component: AdminPageComponent },

  // ── Community ──
  { path: 'stories',     component: StoriesPageComponent },
  { path: 'communities', component: CommunitiesPageComponent },

  // ── Fallback ──
  { path: '**', redirectTo: '' }
];
