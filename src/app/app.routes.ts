import { Routes } from '@angular/router';
import { HuntComponent } from './hunt/hunt';
import { LeaderboardComponent } from './leaderboard/leaderboard';

export const routes: Routes = [
  { path: 'hunt', component: HuntComponent },        // Changed 'scan' to 'hunt' to match your nav
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '', redirectTo: '/leaderboard', pathMatch: 'full' }
];