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
  private cdr = inject(ChangeDetectorRef);

  // 9 Stations for the 3x3 grid
  allStations = [
    { id: 'Station1', label: 'The Saloon', task: 'Question: Who wrote "The Glass Menagerie"?' },
    { id: 'Station2', label: 'Stage Door', task: 'Task: Take a selfie with an STO member.' },
    { id: 'Station3', label: 'Main Lobby', task: 'Question: What is the "Ghost Light" for?' },
    { id: 'Station4', label: 'Workshop A', task: 'Task: Identify three types of stage knots.' },
    { id: 'Station5', label: 'Tech Booth', task: 'Question: What does "DMX" stand for?' },
    { id: 'Station6', label: 'Green Room', task: 'Task: Recite a 30-second monologue.' },
    { id: 'Station7', label: 'Costume Shop', task: 'Question: What is a "sloper" in sewing?' },
    { id: 'Station8', label: 'Box Office', task: 'Task: Explain what "Will Call" means.' },
    { id: 'Station9', label: 'Stage Right', task: 'Question: Where is "Downstage" located?' }
  ];

  unlockedBadges: string[] = [];
  studentName: string | null = '';
  activeStation: any = null;

  async ngOnInit() {
    this.route.queryParams.subscribe(async (params) => {
      const posterId = params['id'];
      this.studentName = localStorage.getItem('studentName');
      const troupe = localStorage.getItem('troupeNum');

      // Check for mission scan
      const match = this.allStations.find(s => s.id === posterId);
      if (match && !this.unlockedBadges.includes(posterId)) {
        this.activeStation = match;
      }

      await this.loadMyBadges();
      this.cdr.detectChanges();
    });
  }

  // FIXED: All these functions must be inside this final closing brace }
  async completeTask(stationId: string) {
    const name = localStorage.getItem('studentName');
    const troupe = localStorage.getItem('troupeNum');
    
    if (name && troupe) {
      await this.saveBadge(name, troupe, stationId);
      this.activeStation = null;
      await this.loadMyBadges();
      this.cdr.detectChanges();
    }
  }

  async saveBadge(name: string, troupe: string, posterId: string) {
    const studentId = `${name}-${troupe}`.replace(/\s+/g, '-').toLowerCase();
    const badgeRef = doc(this.firestore, `students/${studentId}/badges/${posterId}`);
    
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
      this.unlockedBadges = snap.docs.map(d => d.id);
      this.cdr.detectChanges();
    }
  }
} // <--- Make sure this brace is at the very bottom!