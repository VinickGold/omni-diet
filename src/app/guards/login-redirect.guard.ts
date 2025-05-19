import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
} from '@angular/router';
import { AuthService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class LoginRedirectGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean | UrlTree> {
    const { data } = await this.auth.getUser();
    const user = data.user;
    const confirmed = !!user?.email_confirmed_at;

    // Se estiver logado e confirmado, redireciona para o dashboard
    if (user && confirmed) {
      return this.router.createUrlTree(['/home']);
    }

    // Caso contrário, permite o acesso ao login
    return true;
  }
}
