import { inject, Injectable } from '@angular/core';
import {
  createClient,
  SupabaseClient,
  AuthChangeEvent,
  Session,
  User,
} from '@supabase/supabase-js';
import { environment } from '../../env/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase: SupabaseClient;
  //private currentUser: User | null = null;

  constructor() {
    this.supabase = inject(SupabaseClient); //createClient(environment.supabaseUrl, environment.supabaseKey);

    // Keep user in memory when auth state changes
    // this.supabase.auth.getSession().then(({ data }) => {
    //   console.log('.1')
    //   this.currentUser = data.session?.user ?? null;
    // });

    // this.supabase.auth.onAuthStateChange((event, session) => {
    //   console.log('.2')
    //   this.currentUser = session?.user ?? null;
    // });
  }

  async signUp(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({ email, password });
    if (error) throw error;
    console.log('.3')
    //this.currentUser = data.user ?? null;
    localStorage.setItem('auth' , JSON.stringify(data.user));
    return data;
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    console.log('.4')
    //this.currentUser = data.user ?? null;
    localStorage.setItem('auth' , JSON.stringify(data.user));
    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    console.log('.5')
    //this.currentUser = null;
    localStorage.setItem('auth' , JSON.stringify(null));
    if (error) throw error;
  }

  getSession() {
    console.log('.6')
    return this.supabase.auth.getSession();
  }

  getCurrentUser(): User | null {
    console.log('.7')
    let u = localStorage.getItem('auth');
    let u2 = JSON.parse(u ?? 'null');
    //return this.currentUser;
    return u2;
  }

  // async ensureUser(): Promise<User | null> {
  //   if (this.currentUser) return this.currentUser;
  //   const { data, error } = await this.supabase.auth.getSession();
  //   if (error || !data.session) return null;
  //   console.log('.8')
  //   this.currentUser = data.session.user;
  //   return this.currentUser;
  // }

  // onAuthStateChange(callback: (event: AuthChangeEvent, session: Session | null) => void) {
  //   this.supabase.auth.onAuthStateChange(callback);
  // }
}
