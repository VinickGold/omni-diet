import { Injectable, inject } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbWrapperService {

  private dbService: NgxIndexedDBService;
  constructor() {
    console.log('DB Wrapper constructed');
    this.dbService = inject(NgxIndexedDBService);
  }

  async add<T extends object, TKey = IDBValidKey>(
    storeName: string,
    value: T
  ): Promise<T & { id: TKey }> {
    const result = await firstValueFrom(this.dbService.add(storeName, value));
    const id = (result as any)?.id;

    if (id === undefined || id === null) {
      throw new Error('Falha ao adicionar item no IndexedDB: ID não encontrado');
    }

    return { ...value, id } as T & { id: TKey };
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    const result = await firstValueFrom(this.dbService.getAll(storeName));
    return Array.isArray(result) ? (result as T[]) : [];
  }

    async getById<T, TKey extends IDBValidKey>(
    storeName: string,
    id: TKey
    ): Promise<T | undefined> {
    const result = await firstValueFrom(this.dbService.getByKey(storeName, id));
    return result as T | undefined;
    }

  async update<T extends { id: TKey }, TKey = IDBValidKey>(
    storeName: string,
    value: T
  ): Promise<void> {
    await firstValueFrom(this.dbService.update(storeName, value));
  }

async delete<TKey extends IDBValidKey>(
  storeName: string,
  id: TKey
): Promise<void> {
  await firstValueFrom(this.dbService.delete(storeName, id));
}

  async clear(storeName: string): Promise<void> {
    await firstValueFrom(this.dbService.clear(storeName));
  }

  async count(storeName: string): Promise<number> {
    const result = await firstValueFrom(this.dbService.count(storeName));
    return typeof result === 'number' ? result : 0;
  }
}
