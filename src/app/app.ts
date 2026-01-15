import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router'; // 1. Import these

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink], // 2. Add them to the imports array
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent {
  title = 'scavenger-hunt-app';
}