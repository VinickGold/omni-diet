import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/authentication.service';

@Injectable({ providedIn: 'root' })
export class LoginRedirectGuard implements CanActivate 
{
  constructor(
    private auth: AuthService, 
    private router: Router) 
  {}

  async canActivate(): Promise<boolean | UrlTree> 
  {
    const user = await this.auth.getCurrentUser();
    const confirmed = !!user?.email_confirmed_at;

    console.log('User recuperado no login redirect guard:' ,  user)
    if (user && confirmed) {
      return this.router.createUrlTree(['/home']);
    }

    return true;
  }
}

