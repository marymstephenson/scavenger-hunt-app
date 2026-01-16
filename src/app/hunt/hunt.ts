import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Firestore, doc, setDoc, serverTimestamp, collection, getDocs } from '@angular/fire/firestore';

@Component({
  selector: 'app-hunt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './hunt.html',
  styleUrl: './hunt.scss'
})
export class HuntComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef); // Forces the screen to update

  allStations = ['StageDoor', 'MainLobby', 'WorkshopA', 'TechnicalBooth', 'GreenRoom'];
  unlockedBadges: string[] = [];
  studentName: string | null = '';

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      const posterId = params['id'];
      this.studentName = localStorage.getItem('studentName');
      const troupe = localStorage.getItem('troupeNum');

      if (this.studentName && troupe) {
        // 1. If there's an ID, save it first
        if (posterId) {
          await this.saveBadge(this.studentName, troupe, posterId);
        }
        
        // 2. Load the badges and FORCE the screen to "re-draw"
        await this.loadMyBadges();
        this.cdr.detectChanges(); 
      }
    });
  }

  async saveBadge(name: string, troupe: string, posterId: string) {
    const studentId = `${name}-${troupe}`.replace(/\s+/g, '-').toLowerCase();
    const badgeRef = doc(this.firestore, `students/${studentId}/badges/${posterId}`);
    
    // This is what you see in your screenshot!
    await setDoc(badgeRef, { found: true, time: serverTimestamp() }, { merge: true });

    const studentRef = doc(this.firestore, `students/${studentId}`);
    await setDoc(studentRef, { 
      name, 
      troupe, 
      badgeCount: this.unlockedBadges.length + 1,
      lastActive: serverTimestamp() 
    }, { merge: true });
  }

  async loadMyBadges() {
    const name = localStorage.getItem('studentName');
    const troupe = localStorage.getItem('troupeNum');
    
    if (name && troupe) {
      const studentId = `${name}-${troupe}`.replace(/\s+/g, '-').toLowerCase();
      const colRef = collection(this.firestore, `students/${studentId}/badges`);
      const snap = await getDocs(colRef);
      
      // We map the document names (StageDoor) to our list
      this.unlockedBadges = snap.docs.map(d => d.id);
      console.log("SUCCESS: Found these stars in DB:", this.unlockedBadges);
      this.cdr.detectChanges();
    }
  }
}