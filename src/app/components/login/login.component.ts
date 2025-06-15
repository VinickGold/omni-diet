import { Component } from '@angular/core';
import { AuthService } from '../../services/authentication.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginPage {
  email = '';
  password = '';
  message = '';
  loading = false;

  constructor(private auth: AuthService, private router: Router) {}

  async login() {
    this.loading = true;
    this.message = '';
    try {
      const result = await this.auth.signIn(this.email, this.password);

      // Verifica se o e-mail foi confirmado
      // const user = await this.auth.ensureUser();
      const user = result.user; // await this.auth.getCurrentUser();
      const confirmed = !!user?.email_confirmed_at;

      if (!confirmed) {
        this.message = '⚠️ Verifique seu e-mail antes de continuar.';
        await this.auth.signOut();
      } else {
        this.message = '✅ Login bem-sucedido!';
        this.router.navigate(['/home']);
      }
    } catch (err: any) {
      this.message = '❌ Erro: ' + err.message;
    } finally {
      this.loading = false;
    }
  }

  async logout() {
    this.loading = true;
    try {
      await this.auth.signOut();
      this.message = 'Você saiu da conta.';
      this.router.navigate(['/login']);
    } catch (err: any) {
      this.message = 'Erro ao sair: ' + err.message;
    } finally {
      this.loading = false;
    }
  }

  async register() {
    this.loading = true;
    this.message = '';
    try {
      await this.auth.signUp(this.email, this.password);
      this.message = '✅ Conta criada com sucesso! Verifique seu e-mail antes de logar.';
    } catch (err: any) {
      this.message = '❌ Erro ao criar conta: ' + err.message;
    } finally {
      this.loading = false;
    }
  }
}
