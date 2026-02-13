import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  
  // Check if studentName exists in local storage
  const isLogged = !!localStorage.getItem('studentName');

  if (isLogged) {
    return true; // Let them through!
  } else {
    // Save the URL they were trying to go to so we can send them back after login
    // router.navigate(['/login'], { queryParams: { returnUrl: state.url }}); 
    
    router.navigate(['/login']);
    return false; // Stop them right there.
  }
};