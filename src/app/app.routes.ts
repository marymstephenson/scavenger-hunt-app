import { Routes } from '@angular/router';
import { HomeComponent } from './home/home'; // Changed from './home/home.component'
import { HuntComponent } from './hunt/hunt'; // Changed from './hunt/hunt.component'
import { LeaderboardComponent } from './leaderboard/leaderboard'; // Changed from './leaderboard/leaderboard.component'

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'hunt', component: HuntComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
];