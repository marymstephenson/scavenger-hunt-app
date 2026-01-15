import { Component, OnInit, OnDestroy } from '@angular/core';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  template: `<h2>Leaderboard</h2><p>Last updated: {{ lastUpdated | date:'mediumTime' }}</p>`
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  refreshTimer: any;
  lastUpdated: Date = new Date();

  ngOnInit() {
    // Refresh the data every 60 seconds
    this.refreshTimer = setInterval(() => {
      this.updateLeaderboard();
    }, 60000); 
  }

  updateLeaderboard() {
    this.lastUpdated = new Date();
    console.log('Fetching new leaderboard data from server...');
    // Later, we will add the actual database fetch code here
  }

  ngOnDestroy() {
    // Very important: Stop the timer when the user leaves the page
    if (this.refreshTimer) {
      clearInterval(this.refreshTimer);
    }
  }
}