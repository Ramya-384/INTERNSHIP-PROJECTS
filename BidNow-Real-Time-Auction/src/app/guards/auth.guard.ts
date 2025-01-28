import { inject, Injectable } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (
  route, 
  state
): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.getCurrentUser().pipe(
    take(1),
    map((user) => {
      if (user) {
        const requiredRole = route.data['role'];
        if (requiredRole && user.role === requiredRole) {
          return true;
        }
        router.navigate(['/']);
        return false;
      }
      router.navigate(['/login']);
      return false;
    })
  );
};