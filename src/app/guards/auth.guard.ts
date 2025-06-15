import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/authentication.service'; 

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate 
{
  constructor(
    private supabase: AuthService,
    private router: Router) 
  {}

  async canActivate(): Promise<boolean | UrlTree> 
  {
    //const user = await this.supabase.ensureUser();
    const user = await this.supabase.getCurrentUser();

    console.log('Usuário recuperado no guard de autenticação:' , user);

    const confirmed = !!user?.email_confirmed_at;

    if (user && confirmed) return true;

    return this.router.createUrlTree(['/login']);
  }
}
