import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router'; // 1. Import ActivatedRoute
import { PlayerService } from '../player'; // Removed '.service' and adjusted the path

@Component({
  selector: 'app-hunt',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div style="max-width: 500px; margin: auto; padding: 20px; font-family: sans-serif;">
      <h2>Hello, {{ playerService.getName() }}!</h2>
      <p>Items Found: {{ getCount() }} / {{ items.length }}</p>

      <div style="background: #f0f0f0; padding: 15px; border-radius: 10px; margin-bottom: 20px; border: 2px dashed #999;">
        <p style="margin-top: 0; font-weight: bold; color: #666;">Simulate NFC Tag Scan:</p>
        <button (click)="markItemAsFound('tag1')" style="margin-right: 5px; cursor: pointer;">Scan Sunflower</button>
        <button (click)="markItemAsFound('tag2')" style="margin-right: 5px; cursor: pointer;">Scan Mural</button>
        <button (click)="markItemAsFound('tag3')" style="cursor: pointer;">Scan Tree</button>
      </div>

      <div *ngIf="getCount() === items.length" 
          style="background: #d4edda; color: #155724; padding: 20px; border-radius: 10px; text-align: center; margin-bottom: 20px; border: 2px solid #c3e6cb;">
        <h3>🎉 Quest Complete! 🎉</h3>
        <p>You've found everything! Head to the festival booth to claim your prize.</p>
      </div>

      <div *ngFor="let item of items" style="margin-bottom: 15px; padding: 10px; border-bottom: 1px solid #eee;">
        <span [style.text-decoration]="item.found ? 'line-through' : 'none'">
           {{ item.found ? '✅' : '⬜' }} {{ item.name }}
        </span>
      </div>
    </div>
  `
})
export class HuntComponent implements OnInit {
  items = [
    { id: 'tag1', name: 'Giant Sunflower', found: false },
    { id: 'tag2', name: 'Main Stage Mural', found: false },
    { id: 'tag3', name: 'Old Oak Tree', found: false }
  ];
  lastScanned = '';

   constructor(
     private route: ActivatedRoute, 
     public playerService: PlayerService
   ) {}

  ngOnInit() {
    // 1. Load saved progress from LocalStorage
    const savedIds = this.playerService.loadProgress();
  
    // 2. Mark those items as found in our current list
    this.items.forEach(item => {
      if (savedIds.includes(item.id)) {
        item.found = true;
      }
    });

    // 3. Keep listening for new NFC tags via URL
    this.route.queryParams.subscribe(params => {
      const scannedId = params['id'];
      if (scannedId) this.markItemAsFound(scannedId);
    });
  }

  markItemAsFound(id: string) {
    const item = this.items.find(i => i.id === id);
    if (item && !item.found) {
      item.found = true;
    
      // 4. Save the new state so it survives a refresh
      const currentlyFoundIds = this.items
        .filter(i => i.found)
        .map(i => i.id);
      this.playerService.saveProgress(currentlyFoundIds);
    }
  }

  getCount() { return this.items.filter(i => i.found).length; }
}