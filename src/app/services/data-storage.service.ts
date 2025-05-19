import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DataStorageService {
  constructor() {}

  /**
   * Salva os dados no armazenamento local como um arquivo JSON.
   * @param key Nome do arquivo (chave) que será salvo.
   * @param data Dados que serão armazenados.
   */
  saveData(key: string, data: any): void {
    try {
      const jsonData = JSON.stringify(data, null, 2); // Formata para JSON legível
      localStorage.setItem(key, jsonData); // Simula a persistência do arquivo
      console.log(`Dados salvos com sucesso na chave: ${key}`);
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
    }
  }

  /**
   * Carrega os dados do armazenamento local com base na chave fornecida.
   * @param key Nome do arquivo (chave) a ser carregado.
   * @returns Os dados carregados ou `null` se não encontrados.
   */
  loadData<T>(key: string): T | null {
    try {
      const jsonData = localStorage.getItem(key); // Simula a leitura do arquivo
      if (jsonData) {
        return JSON.parse(jsonData) as T;
      } else {
        console.warn(`Nenhum dado encontrado para a chave: ${key}`);
        return null;
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      return null;
    }
  }

  /**
   * Remove os dados do armazenamento local para a chave fornecida.
   * @param key Nome do arquivo (chave) a ser removido.
   */
  deleteData(key: string): void {
    try {
      localStorage.removeItem(key); // Remove os dados simulando a exclusão do arquivo
      console.log(`Dados removidos com sucesso para a chave: ${key}`);
    } catch (error) {
      console.error('Erro ao remover dados:', error);
    }
  }
}