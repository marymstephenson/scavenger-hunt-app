import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HuntComponent } from './hunt/hunt.component';
import { LeaderboardComponent } from './leaderboard/leaderboard.component';

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Default page
  { path: 'hunt', component: HuntComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
];