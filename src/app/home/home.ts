import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router'; // Added ActivatedRoute

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './home.html'
})
export class HomeComponent {
  private router = inject(Router);
  private route = inject(ActivatedRoute); // Needed to remember the QR code

  studentName: string = '';
  troupeNum: string = '';
  favNum: string = '';

  login() {
    if (this.studentName && this.troupeNum) {
      // 1. Generate a simple ID for Firebase (e.g., "john-doe-1234")
      const studentId = `${this.studentName.replace(/\s+/g, '-').toLowerCase()}-${this.troupeNum}`;
      
      // 2. Save everything the Hunt & Leaderboard need
      localStorage.setItem('studentName', this.studentName);
      localStorage.setItem('studentId', studentId); // Crucial for Firestore sync!
      localStorage.setItem('troupe', this.troupeNum); // Leaderboard expects 'troupe'
      
      // 3. QR REDIRECT LOGIC
      // Check if the student scanned a QR code before logging in
      const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/hunt';
      
      // 4. Send them to their destination!
      this.router.navigateByUrl(returnUrl);

    } else {
      alert("Hold your horses! We need your name and troupe number first.");
    }
  }
}