import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanActivateFn, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthGuard implements CanActivate {
  constructor(private authApi: AuthService, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      const isAuthenticated = this.authApi.isAuthenticated();
      console.log('Is Authenticated:', isAuthenticated);
      if (this.authApi.isValidToken()) {
        return true;
      } else {
        console.log('Please Log In!');
        this.router.navigate(['/login']);
        return false;
      }
  }
}
