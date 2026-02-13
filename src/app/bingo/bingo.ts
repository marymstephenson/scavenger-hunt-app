import { Component, signal, computed, effect, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface BingoSquare {
  id: number;
  college: string;
  question: string;
  answers?: string[]; // Array for fuzzy matching (e.g., ['Orange', 'Orange and Blue'])
  type: 'trivia' | 'challenge' | 'free';
  img: string;
  completed: boolean;
  key?: string; // Unique ID for QR/NFC scans
}

@Component({
  selector: 'app-bingo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bingo.html',
  styleUrl: './bingo.scss'
})
export class BingoComponent {
  private cdr = inject(ChangeDetectorRef);
  private route = inject(ActivatedRoute);

  studentName = localStorage.getItem('studentName') || 'Thespian';
  showWinScreen = signal(false);
  
  // This tracks which square is currently open in the popup
  activeQuestionSquare = signal<BingoSquare | null>(null);
  userAnswer = signal('');

  // Track QR/NFC scans from localStorage
  visitedTables = signal<string[]>(this.loadVisitedTables());
  
  // Board state (Trivia clicks + Challenge statuses)
  squares = signal<BingoSquare[]>(this.loadBingoState());

  private winningLines = [
    [0, 1, 2, 3, 4], [5, 6, 7, 8, 9], [10, 11, 12, 13, 14], [15, 16, 17, 18, 19], [20, 21, 22, 23, 24],
    [0, 5, 10, 15, 20], [1, 6, 11, 16, 21], [2, 7, 12, 17, 22], [3, 8, 13, 18, 23], [4, 9, 14, 19, 24],
    [0, 6, 12, 18, 24], [4, 8, 12, 16, 20]
  ];

  constructor() {
    // 1. URL TESTING LOGIC: Checks for ?table=KEY in the URL
    this.route.queryParams.subscribe(params => {
      const tableKey = params['table'];
      if (tableKey) {
        this.unlockChallenge(tableKey);
      }
    });

    // 2. Persist state and check for BINGO
    effect(() => {
      localStorage.setItem('bingoBoardState', JSON.stringify(this.squares()));
      localStorage.setItem('visitedTables', JSON.stringify(this.visitedTables()));
      
      if (this.hasWonBingo()) {
        this.showWinScreen.set(true);
        this.cdr.detectChanges();
      }
    }, { allowSignalWrites: true });
  }

  hasWonBingo = computed(() => {
    return this.winningLines.some(line => 
      line.every(index => this.isSquareDone(this.squares()[index]))
    );
  });

  isSquareDone(square: BingoSquare): boolean {
    if (!square) return false;
    if (square.type === 'free') return this.visitedTables().length >= 10;
    if (square.type === 'challenge') return this.visitedTables().includes(square.key || '');
    return square.completed;
  }

  handleSquareClick(square: BingoSquare) {
    if (!square || this.isSquareDone(square)) return;
    this.userAnswer.set('');
    this.errorMessage.set(null); // Clear error when opening new question
    this.activeQuestionSquare.set(square);
    this.cdr.detectChanges();
  }

  // Update your checkAnswer function
  checkAnswer() {
    const square = this.activeQuestionSquare();
    if (!square) return;

    const input = this.userAnswer().toLowerCase().trim();
    const isCorrect = square.answers?.some(a => a.toLowerCase().trim() === input);

    if (isCorrect) {
      this.squares.update(current => 
        current.map(s => s.id === square.id ? { ...s, completed: true } : s)
      );
      this.activeQuestionSquare.set(null);
      this.errorMessage.set(null); // Clear error on success
    } else {
      // Set a cute error message instead of an alert
      this.errorMessage.set("Break a leg... but try a different answer! ✨");
    }
    this.cdr.detectChanges();
  }

  // Unlocks a square via QR/NFC code
  unlockChallenge(key: string) {
    if (!this.visitedTables().includes(key)) {
      this.visitedTables.update(prev => [...prev, key]);
      this.cdr.detectChanges();
    }
  }

  private loadVisitedTables(): string[] {
    const saved = localStorage.getItem('visitedTables');
    return saved ? JSON.parse(saved) : [];
  }

  private loadBingoState(): BingoSquare[] {
    const saved = localStorage.getItem('bingoBoardState');
    if (saved) {
      // Basic check to see if the saved data matches our new structure
      const parsed = JSON.parse(saved);
      if (parsed[0] && parsed[0].hasOwnProperty('question')) return parsed;
    }

    // EASY EDIT SECTION: Add your real questions/answers here!
    return [
      { id: 0, college: 'Auburn', question: 'School Colors?', answers: ['Orange and Blue', 'Blue and Orange'], type: 'trivia', img: 'auburn.svg', completed: false },
      { id: 1, college: 'UAB', question: 'CHALLENGE: 10s Monologue!', type: 'challenge', key: 'UAB_CHALLENGE', img: 'uab.svg', completed: false },
      { id: 2, college: 'Alabama', question: 'Famous Food?', answers: ['Dreamland', 'Rama Jama'], type: 'trivia', img: 'alabama.svg', completed: false },
      { id: 3, college: 'North-Alabama', question: 'Student Club?', answers: ['Drama', 'Art'], type: 'trivia', img: 'north-alabama.svg', completed: false },
      { id: 4, college: 'Troy', question: 'CHALLENGE: Stage Fall!', type: 'challenge', key: 'TROY_CHALLENGE', img: 'troy.svg', completed: false },
      
      { id: 5, college: 'Samford', question: 'Mascot?', answers: ['Spike', 'Bulldog'], type: 'trivia', img: 'samford.svg', completed: false },
      { id: 6, college: 'Columbus-State', question: 'CHALLENGE: Tongue Twister!', type: 'challenge', key: 'CSU_CHALLENGE', img: 'columbus-state.svg', completed: false },
      { id: 7, college: 'AUM', question: 'Year Founded?', answers: ['1967'], type: 'trivia', img: 'aum.svg', completed: false },
      { id: 8, college: 'Auburn', question: 'CHALLENGE: High-Five Rep!', type: 'challenge', key: 'AUBURN_CHALLENGE', img: 'auburn.svg', completed: false },
      { id: 9, college: 'UAB', question: 'Library Name?', answers: ['Sterne'], type: 'trivia', img: 'uab.svg', completed: false },
      
      { id: 10, college: 'Alabama', question: 'CHALLENGE: Oscar Speech!', type: 'challenge', key: 'BAMA_CHALLENGE', img: 'alabama.svg', completed: false },
      { id: 11, college: 'North-Alabama', question: 'Campus Landmark?', answers: ['Fountain'], type: 'trivia', img: 'north-alabama.svg', completed: false },
      { id: 12, college: 'FREE', question: 'Scan 10 tables!', type: 'free', img: 'badge.svg', completed: false },
      { id: 13, college: 'Troy', question: 'Mascot Name?', answers: ['T-Roy'], type: 'trivia', img: 'troy.svg', completed: false },
      { id: 14, college: 'Samford', question: 'CHALLENGE: Shakespeare Read!', type: 'challenge', key: 'SAMFORD_CHALLENGE', img: 'samford.svg', completed: false },
      
      { id: 15, college: 'Columbus-State', question: 'Student Pop?', answers: ['8000'], type: 'trivia', img: 'columbus-state.svg', completed: false },
      { id: 16, college: 'AUM', question: 'CHALLENGE: Dramatic Death!', type: 'challenge', key: 'AUM_CHALLENGE', img: 'aum.svg', completed: false },
      { id: 17, college: 'Auburn', question: 'Famous Alumni?', answers: ['Tim Cook', 'Octavia Spencer'], type: 'trivia', img: 'auburn.svg', completed: false },
      { id: 18, college: 'UAB', question: 'School Colors?', answers: ['Green and Gold'], type: 'trivia', img: 'uab.svg', completed: false },
      { id: 19, college: 'Alabama', question: 'What Mascot?', answers: ['Big Al', 'Elephant'], type: 'trivia', img: 'alabama.svg', completed: false },
      
      { id: 20, college: 'North-Alabama', question: 'CHALLENGE: Emotion Statue!', type: 'challenge', key: 'UNA_CHALLENGE', img: 'north-alabama.svg', completed: false },
      { id: 21, college: 'Troy', question: 'School Colors?', answers: ['Cardinal and Silver'], type: 'trivia', img: 'troy.svg', completed: false },
      { id: 22, college: 'Samford', question: 'Year Founded?', answers: ['1841'], type: 'trivia', img: 'samford.svg', completed: false },
      { id: 23, college: 'Columbus-State', question: 'Colors?', answers: ['Blue and White'], type: 'trivia', img: 'columbus-state.svg', completed: false },
      { id: 24, college: 'AUM', question: 'Mascot Name?', answers: ['Curtiss', 'Warhawk'], type: 'trivia', img: 'aum.svg', completed: false }
    ];
  }

  // Add this near your other signals
errorMessage = signal<string | null>(null);

}