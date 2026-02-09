// src/app/app.ts
import { Component, signal, effect } from '@angular/core'; // Added 'effect' here
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  globalProgress = signal<number>(this.loadProgress());

  constructor() {
    // This 'effect' will now work perfectly
    effect(() => {
      localStorage.setItem('scavengerProgress', this.globalProgress().toString());
    });
  }

  private loadProgress(): number {
    const saved = localStorage.getItem('scavengerProgress');
    return saved ? parseInt(saved, 10) : 0;
  }
}