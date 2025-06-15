import { inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { ImportedFood } from './../models/models'
import { IndexedDbWrapperService } from './indexed-db.service';
import { AuthService } from './authentication.service';

@Injectable({ providedIn: 'root' })
export class FoodSyncService {

  //private dbService : IndexedDbWrapperService;
  constructor(
    //private dbService: ,
    private authService: AuthService,
    //private supabase: SupabaseClient
  ) {
      //this.dbService = inject(IndexedDbWrapperService);
  }

  // private get supabase() {
  //   return inject(SupabaseClient); // ✅ lazy inject
  // }

  // private get dbService() {
  //   return inject(IndexedDbWrapperService); // ✅ lazy inject
  // }
  private supabase = inject(SupabaseClient);
  private dbService = inject(IndexedDbWrapperService);

  private getLastSync(): Date {
    return new Date(localStorage.getItem('lastSync') || '1970-01-01T00:00:00Z');
  }

  private setLastSync(date: Date) {
    localStorage.setItem('lastSync', date.toISOString());
  }

  async sync(): Promise<void> {
    const lastSync = this.getLastSync();
    const role = (await this.authService.getSession()).data.session?.user.role;

    if (role?.toLocaleLowerCase().includes('auth')) {
      const localFoods = await this.dbService.getAll<ImportedFood>('foods');

      console.log('Total de alimentos na base local' , localFoods.length);

      const updatedLocals = localFoods.filter(x => new Date(x.updatedAt || lastSync) > lastSync );

      console.log('Total de alimentos que precisam atualizar no remote' , updatedLocals.length);

      for (const food of updatedLocals) {
        const { imageUrl, ...foodToInsert } = food;

        console.log('Tentando sincronizar', food);
        await this.supabase
          .from('foods')
          .upsert(foodToInsert, { onConflict: 'id' });
      }
    }

    const { data: remoteFoods, error } = await this.supabase
      .from('foods')
      .select('*')
      .gt('updatedAt', lastSync.toISOString());

    if (error) {
      console.error('Erro ao buscar do Supabase:', error);
      return;
    }

    console.log('Total de alimentos recebidos do remote' , remoteFoods.length);

    for (const food of remoteFoods ?? []) {
      await this.dbService.update('foods', {
        ...food,
        updatedAt: food.updatedAt
      });
    }

    this.setLastSync(new Date());
  }

  async syncIfNeeded(): Promise<void> {
    const lastSync = this.getLastSync();
    const now = new Date();
    const diffMs = now.getTime() - lastSync.getTime();
    const hoursPassed = diffMs / (1000 * 60 * 60);

    if (hoursPassed > 6) {
      console.log('⏳ Iniciando sincronização automática...');
      await this.sync();
    } else {
      console.log(`⏸️ Última sincronização foi há ${hoursPassed.toFixed(1)} horas. Pulando sync.`);
    }
  }
}
