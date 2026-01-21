import { Routes } from '@angular/router';
import { HomeComponent } from './home/home'; // Ensure this path is correct
import { HuntComponent } from './hunt/hunt';
import { LeaderboardComponent } from './leaderboard/leaderboard';

export const routes: Routes = [
  { path: '', component: HomeComponent },             // Home page is now the default
  { path: 'hunt', component: HuntComponent },         // Scavenger Hunt grid
  { path: 'leaderboard', component: LeaderboardComponent }, 
  { path: '**', redirectTo: '' }                      // Redirect any errors to Home
];