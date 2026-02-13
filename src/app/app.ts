import { Component, signal, effect, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class AppComponent {
  private route = inject(ActivatedRoute);
  
  // The 'source of truth' for visited tables
  visitedTableNames = signal<string[]>(this.loadVisitedTables());
  // This signal calculates the count based on the array length
  globalProgress = signal<number>(this.visitedTableNames().length);

  constructor() {
    // Listen for the ?table= URL parameter
    this.route.queryParams.subscribe(params => {
      const tableName = params['table'];
      if (tableName) {
        this.registerTableVisit(tableName);
      }
    });

    // Save to phone memory whenever the list changes
    effect(() => {
      localStorage.setItem('visitedTables', JSON.stringify(this.visitedTableNames()));
    });
  }

  registerTableVisit(name: string) {
    const currentList = this.visitedTableNames();
    
    // Only add the table if it hasn't been visited yet (prevents double-counting)
    if (!currentList.includes(name)) {
      this.visitedTableNames.update(list => [...list, name]);
      // Update the progress count
      this.globalProgress.set(this.visitedTableNames().length);
      console.log('New table visited:', name, 'Total:', this.globalProgress());
    }
  }

  private loadVisitedTables(): string[] {
    const saved = localStorage.getItem('visitedTables');
    return saved ? JSON.parse(saved) : [];
  }
}