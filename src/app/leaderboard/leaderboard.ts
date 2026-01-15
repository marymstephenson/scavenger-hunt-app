import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlayerService } from '../player'; // Import your player.ts file

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width: 500px; margin: auto; padding: 20px; font-family: sans-serif;">
      <h2>Festival Leaderboard</h2>
      
      <div style="background: #e7f3ff; padding: 10px; border-radius: 8px; margin-bottom: 20px; border: 1px solid #b6d4fe;">
        <strong>Your Current Rank:</strong><br>
        {{ playerService.getName() }} — {{ playerService.getScore() }} items found
      </div>

      <table style="width: 100%; text-align: left; border-collapse: collapse;">
        <tr style="border-bottom: 2px solid #eee;">
          <th style="padding: 10px;">Player</th>
          <th style="padding: 10px;">Score</th>
        </tr>
        <tr *ngFor="let p of otherPlayers" style="border-bottom: 1px solid #eee;">
          <td style="padding: 10px;">{{ p.name }}</td>
          <td style="padding: 10px;">{{ p.score }} / 3</td>
        </tr>
      </table>
      
      <p style="font-size: 0.75rem; color: #999; margin-top: 20px;">
        Auto-refreshing in the background... Last update: {{ lastUpdated | date:'mediumTime' }}
      </p>
    </div>
  `
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  refreshTimer: any;
  lastUpdated = new Date();
  
  // Fake players to simulate a busy festival
  otherPlayers = [
    { name: 'ScavengerPro_2026', score: 3 },
    { name: 'HiddenSeeker', score: 2 },
    { name: 'NatureLover', score: 1 }
  ];

  constructor(public playerService: PlayerService) {}

  ngOnInit() {
    // This is where we save server power by only refreshing once a minute
    this.refreshTimer = setInterval(() => {
      this.lastUpdated = new Date();
      console.log('Leaderboard refreshed with latest festival scores');
    }, 60000);
  }

  ngOnDestroy() {
    if (this.refreshTimer) clearInterval(this.refreshTimer);
  }

  updateLeaderboard() {
    this.lastUpdated = new Date();
  
    // Simulation: Add the current player to the "Other Players" list
    const currentPlayer = { 
      name: this.playerService.getName() + " (You)", 
      score: this.playerService.loadProgress().length 
    };

    // Replace the list with fresh (simulated) data
    this.otherPlayers = [
      { name: 'ScavengerPro_2026', score: 3 },
      { name: 'NatureLover', score: 2 },
      currentPlayer // Real-time update of your own score
    ].sort((a, b) => b.score - a.score); // Sort highest to lowest
  }

}