import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class PlayerService {
  private STORAGE_KEY = 'festival_hunt_progress';

  setName(name: string) {
    localStorage.setItem('festival_player_name', name);
  }

  getName() {
    return localStorage.getItem('festival_player_name') || 'Anonymous';
  }

  getScore(): number {
    const savedProgress = this.loadProgress();
    return savedProgress.length;
  }

  // Save the list of found item IDs
  saveProgress(foundItemIds: string[]) {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(foundItemIds));
  }

  // Load the list of found item IDs
  loadProgress(): string[] {
    const data = localStorage.getItem(this.STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  }
}