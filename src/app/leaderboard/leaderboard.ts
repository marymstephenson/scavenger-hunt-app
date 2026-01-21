import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Firestore, collection, getDocs, query, orderBy, writeBatch, doc, serverTimestamp, deleteDoc } from '@angular/fire/firestore';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './leaderboard.html'
})
export class LeaderboardComponent implements OnInit {
  private firestore = inject(Firestore);
  private cdr = inject(ChangeDetectorRef);

  students: any[] = [];
  isRefreshing = false;

  // 1. Separate the lists for easier display
  get currentCowboys() {
    return this.students.filter(s => s.badgeCount < 9);
  }

  get pastProspectors() {
    return this.students.filter(s => s.badgeCount === 9);
  }

  async ngOnInit() {
    await this.fetchLeaderboard();
  }

  async fetchLeaderboard() {
    this.isRefreshing = true;
    this.cdr.detectChanges();

    const studentsRef = collection(this.firestore, 'students');
    const q = query(studentsRef, orderBy('badgeCount', 'desc'));
    
    try {
      const snap = await getDocs(q);
      this.students = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      this.isRefreshing = false;
      this.cdr.detectChanges();
    }
  }

  // 2. TESTING: Generate 10 random students
  async seedTestData() {
    const names = ['Billy the Kid', 'Calamity Jane', 'Doc Holliday', 'Wyatt Earp', 'Annie Oakley'];
    const batch = writeBatch(this.firestore);

    names.forEach(name => {
      const troupe = Math.floor(1000 + Math.random() * 9000).toString();
      const studentId = `test-${name.replace(/\s+/g, '-').toLowerCase()}`;
      const studentRef = doc(this.firestore, `students/${studentId}`);
      
      batch.set(studentRef, {
        name: name,
        troupe: troupe,
        badgeCount: Math.floor(Math.random() * 10), // Randomly generates 0-9 stars
        lastActive: serverTimestamp()
      });
    });

    await batch.commit();
    await this.fetchLeaderboard();
  }

  // 3. TESTING: Clear all test data
  async clearTestData() {
    const snap = await getDocs(collection(this.firestore, 'students'));
    const deletePromises = snap.docs
      .filter(d => d.id.startsWith('test-'))
      .map(d => deleteDoc(d.ref));
    
    await Promise.all(deletePromises);
    await this.fetchLeaderboard();
  }
}