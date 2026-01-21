import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Required for [(ngModel)]
import { Router, RouterModule } from '@angular/router'; // Required for navigation

@Component({
  selector: 'app-home',
  standalone: true,
  // These must be standalone or NgModules to clear your error
  imports: [CommonModule, FormsModule, RouterModule], 
  templateUrl: './home.html'
})
export class HomeComponent {
  private router = inject(Router);

  // Data fields matching your Western design
  studentName: string = '';
  troupeNum: string = '';
  favNum: string = '';

  login() {
    if (this.studentName && this.troupeNum) {
      // Save to local storage so the Hunt page knows who is playing
      localStorage.setItem('studentName', this.studentName);
      localStorage.setItem('troupeNum', this.troupeNum);
      
      // Navigate to the 9-star grid
      this.router.navigate(['/hunt']);
    } else {
      alert("Hold your horses! We need your name and troupe number first.");
    }
  }
}