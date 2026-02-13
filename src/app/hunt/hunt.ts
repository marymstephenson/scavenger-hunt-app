import { Component, OnInit, inject, signal, computed, ChangeDetectorRef } from '@angular/core'; // Added signal, computed, ChangeDetectorRef
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Firestore, doc, setDoc, serverTimestamp } from '@angular/fire/firestore';

interface Station {
  id: number;
  label: string;
  question: string;
  img: string;
}

@Component({
  selector: 'app-hunt',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './hunt.html',
  styleUrls: ['./hunt.scss']
})
export class HuntComponent implements OnInit {
  // 1. Properly inject dependencies
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef); // This fixes the "cdr does not exist" error

  studentName: string = localStorage.getItem('studentName') || 'Thespian';
  studentId: string = localStorage.getItem('studentId') || '';
  troupe: string = localStorage.getItem('troupe') || '0000';
  
  activeStation: Station | null = null;
  unlockedBadges: number[] = [];
  userAnswer: string = '';
  
  // 2. These now have proper imports from @angular/core
  showHuntWin = signal(false);
  hasCompletedHunt = computed(() => this.unlockedBadges.length === 9);

  allStations: Station[] = [
    { id: 1, label: 'CAFETERIA', question: 'Who did you sit with that was new?', img: 'cafeteria.svg' },
    { id: 2, label: 'COLLEGE TABLES', question: 'What school did you talk to and what did you ask?', img: 'college-tables.svg' },
    { id: 3, label: 'COMPETITION GYM', question: 'What is happening in the gym right now?', img: 'competition-gym.svg' },
    { id: 4, label: 'DANCE ROOM', question: 'What kind of dance is being practiced?', img: 'dance-room.svg' },
    { id: 5, label: 'STO ROOM', question: 'Which STO did you talk to and what did you ask?', img: 'sto-room.svg' },
    { id: 6, label: 'STO WORKSHOP', question: 'What was your favorite part of the workshop?', img: 'sto-workshop.svg' },
    { id: 7, label: 'ROASTERY', question: 'What was your coffee/drink order?', img: 'thespian-roastery.svg' },
    { id: 8, label: 'TABLETOP', question: 'What game did you play?', img: 'thespian-tabletop.svg' },
    { id: 9, label: 'TROUPE DISPLAYS', question: 'Which troupe display was your favorite?', img: 'troupe-displays.svg' }
  ];

  ngOnInit() {
    const saved = localStorage.getItem('unlockedBadges');
    if (saved) {
      this.unlockedBadges = JSON.parse(saved);
    }
  }

  // 3. This method fixes the "openMission does not exist" error in the HTML
  openMission(station: Station) {
    if (!this.unlockedBadges.includes(station.id)) {
      this.userAnswer = '';
      this.activeStation = station;
      this.cdr.detectChanges();
    }
  }

  async completeTask(id: number) {
    if (this.userAnswer.trim().length > 0) {
      if (!this.unlockedBadges.includes(id)) {
        this.unlockedBadges = [...this.unlockedBadges, id];
        localStorage.setItem('unlockedBadges', JSON.stringify(this.unlockedBadges));

        await this.syncWithFirebase();

        // Trigger win screen on 9th badge
        if (this.unlockedBadges.length === 9) {
          this.showHuntWin.set(true);
        }
      }
      this.activeStation = null;
      this.cdr.detectChanges();
    }
  }

  private async syncWithFirebase() {
    if (!this.studentId) {
      this.studentId = this.studentName.replace(/\s+/g, '-').toLowerCase();
    }

    const studentRef = doc(this.firestore, `students/${this.studentId}`);
    try {
      await setDoc(studentRef, {
        name: this.studentName,
        troupe: this.troupe,
        badgeCount: this.unlockedBadges.length,
        lastActive: serverTimestamp()
      }, { merge: true });
    } catch (error) {
      console.error("Firebase sync failed:", error);
    }
  }
}