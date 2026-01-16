import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // <--- The "Bridge" for the nav buttons
import { Firestore, collection, collectionData, query, orderBy } from '@angular/fire/firestore';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  // We MUST include RouterModule here so the links in app.html work
  imports: [CommonModule, RouterModule], 
  templateUrl: './leaderboard.html'
})
export class LeaderboardComponent implements OnInit {
  private firestore = inject(Firestore);
  
  students: any[] = [];
  subscription: Subscription | undefined;
  isAutoRefresh = true;

  ngOnInit() {
    this.startStreaming();
  }

  startStreaming() {
    const studentsRef = collection(this.firestore, 'students');
    // We sort by badgeCount so the winners are at the top for the projector
    const q = query(studentsRef, orderBy('badgeCount', 'desc'));
    
    // Subscribe manually so we can "unsubscribe" to pause the refresh
    this.subscription = collectionData(q, { idField: 'id' }).subscribe(data => {
      this.students = data;
    });
  }

  toggleRefresh() {
    this.isAutoRefresh = !this.isAutoRefresh;
    
    if (this.isAutoRefresh) {
      this.startStreaming(); // Resume listening to database
    } else {
      if (this.subscription) {
        this.subscription.unsubscribe(); // Stop listening (Saves database reads!)
      }
    }
  }
}