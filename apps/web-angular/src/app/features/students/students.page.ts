import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { StudentService, StudentSummary } from '../../core/services/student.service';

@Component({
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="page">
      <section class="hero-card">
        <div class="eyebrow">Students</div>
        <h1>Resident records from the migrated Spring Boot API.</h1>
      </section>

      <section class="cards-grid" *ngIf="students.length; else empty">
        <article class="card" *ngFor="let student of students">
          <h2>{{ student.name }}</h2>
          <p class="muted">{{ student.email }} · {{ student.phone }}</p>
          <div class="list">
            <div><strong>Course:</strong> {{ student.course }} · Year {{ student.year }}</div>
            <div><strong>Roll number:</strong> {{ student.rollNumber }}</div>
            <div><strong>Hostel:</strong> {{ student.hostelBlockId?.blockName || 'Not assigned' }}</div>
          </div>
        </article>
      </section>

      <ng-template #empty>
        <div class="empty-state">No student records were returned.</div>
      </ng-template>
    </div>
  `
})
export class StudentsPageComponent {
  private readonly studentService = inject(StudentService);

  students: StudentSummary[] = [];

  constructor() {
    this.studentService.getStudents().subscribe({
      next: (data) => {
        this.students = data;
      },
      error: () => {
        this.students = [];
      }
    });
  }
}
