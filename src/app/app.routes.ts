import { Routes } from '@angular/router';
import { HuntComponent } from './hunt/hunt';
import { BingoComponent } from './bingo/bingo';
import { LeaderboardComponent } from './leaderboard/leaderboard';
import { HomeComponent } from './home/home';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    // 1. Login is the front door (No guard needed here)
    { path: 'login', component: HomeComponent },

    // 2. The Protected Pages (The "Bouncer" is watching these)
    { 
        path: 'hunt', 
        component: HuntComponent, 
        canActivate: [authGuard] 
    },
    { 
        path: 'bingo', 
        component: BingoComponent, 
        canActivate: [authGuard] 
    },
    { 
        path: 'leaderboard', 
        component: LeaderboardComponent, 
        canActivate: [authGuard] 
    },

    // 3. Redirects
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: '**', redirectTo: 'login' }
];