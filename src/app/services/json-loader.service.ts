import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JsonLoaderService {
  private jsonPath: string | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Define o caminho do arquivo JSON que será carregado.
   */
  setJsonPath(path: string): void {
    this.jsonPath = path;
  }

  /**
   * Carrega e converte o conteúdo do JSON para o tipo T, usando async/await.
   */
  async load<T>(): Promise<T> {
    if (!this.jsonPath) {
      throw new Error('Caminho do JSON não definido. Use setJsonPath(path).');
    }

    try {
      return await firstValueFrom(this.http.get<T>(this.jsonPath));
    } catch (error) {
      console.error('Erro ao carregar JSON:', error);
      throw error;
    }
  }
}