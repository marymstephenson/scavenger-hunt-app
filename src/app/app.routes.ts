import { Routes } from '@angular/router';
import { HuntComponent } from './hunt/hunt';
import { BingoComponent } from './bingo/bingo';
import { LeaderboardComponent } from './leaderboard/leaderboard';
import { HomeComponent } from './home/home'; // Assuming this is your login/landing page

export const routes: Routes = [
  { path: '', component: HomeComponent }, // Make the home/login page the "front door"
  { path: 'hunt', component: HuntComponent },
  { path: 'bingo', component: BingoComponent },
  { path: 'leaderboard', component: LeaderboardComponent },
  { path: '**', redirectTo: '' } // If they type a weird URL, send them home
];