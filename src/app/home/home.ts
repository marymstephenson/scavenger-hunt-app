import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // 1. Import FormsModule for inputs
import { PlayerService } from '../player'; // Removed '.service' and adjusted the path
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div style="max-width: 400px; margin: auto; text-align: center;">
      <h1>Festival Hunt</h1>
      <p>Enter your nickname to start the quest!</p>
      
      <input [(ngModel)]="userName" 
             placeholder="Username..." 
             style="padding: 10px; width: 80%; border-radius: 5px; border: 1px solid #ccc;">
      
      <br><br>
      
      <button (click)="startHunt()" 
              [disabled]="!userName"
              style="padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 5px; cursor: pointer;">
        Start Hunting!
      </button>
    </div>
  `
})
export class HomeComponent {
  userName: string = '';

  constructor(private playerService: PlayerService, private router: Router) {}

  startHunt() {
    this.playerService.setName(this.userName);
    this.router.navigate(['/hunt']); // Send them straight to the game!
  }
}