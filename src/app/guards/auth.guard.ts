import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/authentication.service'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private supabase: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const { data } = await this.supabase.getUser();
    const user = data.user;
    const confirmed = !!user?.email_confirmed_at;

    if (user && confirmed) {
      return true;
    }

    return this.router.createUrlTree(['/login']);
  }
}