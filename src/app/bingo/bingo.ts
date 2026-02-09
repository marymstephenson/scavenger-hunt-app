import { Component, signal, computed, input, effect } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-bingo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './bingo.html',
  styleUrl: './bingo.scss'
})
export class BingoComponent {
  visitedCount = input<number>(0);
  totalNeeded = 10;

  isFreeSpaceUnlocked = computed(() => this.visitedCount() >= this.totalNeeded);

  // Load saved bingo state or start fresh
  squares = signal(this.loadBingoState());

  constructor() {
    // Automatically save whenever a square is toggled
    effect(() => {
      localStorage.setItem('bingoBoardState', JSON.stringify(this.squares()));
    });
  }

  private loadBingoState() {
    const saved = localStorage.getItem('bingoBoardState');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default starting board if no save exists
    return Array.from({ length: 25 }, (_, i) => ({
      id: i,
      text: i === 12 ? 'FREE SPACE' : this.getTriviaText(i),
      completed: false
    }));
  }

  getTriviaText(index: number): string {
    const trivia = [
      "School Color?", "Founding Year?", "Mascot Name?", "Famous Alumni?",
      "Oldest Building?", "Student Pop.?", "Major Library?", "Sports Team?",
      "Campus Landmark?", "Tuition Cost?", "Main Quad?", "Study Spot?",
      "FREE SPACE",
      "Local Food?", "Dorm Name?", "Student Club?", "Research Lab?",
      "Scholarship?", "Career Center?", "Gym Location?", "Music Dept?",
      "Art Gallery?", "State Capital?", "Nearby City?", "Bus Route?"
    ];
    return trivia[index];
  }

  toggleSquare(id: number) {
  if (id === 12) return;
  
  this.squares.update(current =>
    // We tell TypeScript that 's' is an object with these specific properties
    current.map((s: { id: number; text: string; completed: boolean }) => 
      s.id === id ? { ...s, completed: !s.completed } : s
    )
  );
  }
}