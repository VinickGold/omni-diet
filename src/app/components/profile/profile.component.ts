import { Component, OnDestroy, OnInit } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import {CommonModule} from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'profile',
  templateUrl: './profile.component.html',
  standalone: true,
  imports: [RouterModule, FormsModule , CommonModule ],
  providers: [DataStorageService],
})
export class ProfileComponent implements OnInit , OnDestroy {
  sexo: 'masculino' | 'feminino' = 'masculino';
  idade: number = 30;
  peso: number = 70;
  altura: number = 170;
  nivelAtividade: string = 'moderado';
  objetivo: string = 'manter';

  constructor(private storage: DataStorageService) {}

  ngOnInit(): void {
    const saved = this.storage.loadData('profileData');
    if (saved) {
      Object.assign(this, saved);
    }
  }

  ngOnDestroy(): void {
    console.log("DESTROY");
    this.save(); // Salva automaticamente ao sair do componente
  }

  save(): void {
    const macros = this.macros;
    const data = {
      sexo: this.sexo,
      idade: this.idade,
      peso: this.peso,
      altura: this.altura,
      nivelAtividade: this.nivelAtividade,
      objetivo: this.objetivo,
      calorieGoal: this.caloriasAjustadas,
      proteinGoal: macros?.proteina ?? 0,
      carbGoal: macros?.carbo ?? 0,
      fatGoal: macros?.gordura ?? 0,
    };
    this.storage.saveData('profileData', data);
  }

  get tmb(): number {
    return this.sexo === 'masculino'
      ? 10 * this.peso + 6.25 * this.altura - 5 * this.idade + 5
      : 10 * this.peso + 6.25 * this.altura - 5 * this.idade - 161;
  }

  get tmbBase(): number {
    return this.tmb; // Sem ajustes, é só a TMB base
  }

  get fatorAtividade(): number {
    switch (this.nivelAtividade) {
      case 'sedentario': return 1.2;
      case 'leve': return 1.375;
      case 'moderado': return 1.55;
      case 'intenso': return 1.725;
      case 'muito-intenso': return 1.9;
      default: return 1.55;
    }
  }

  get caloriasAjustadas(): number {
    let calorias = this.tmb * this.fatorAtividade;
    switch (this.objetivo) {
      case 'perder-leve': return Math.round(calorias * 0.85);
      case 'perder-moderado': return Math.round(calorias * 0.7);
      case 'ganhar': return Math.round(calorias * 1.15);
      default: return Math.round(calorias);
    }
  }

  get macros() {
    const total = this.caloriasAjustadas;
    if (!total) return null;
    let pctProteina = 0.3, pctCarbo = 0.5, pctGordura = 0.2;
    if (this.objetivo.includes('perder')) {
      pctProteina = 0.4;
      pctCarbo = 0.4;
      pctGordura = 0.2;
    }
    return {
      proteina: Math.round((total * pctProteina) / 4),
      carbo: Math.round((total * pctCarbo) / 4),
      gordura: Math.round((total * pctGordura) / 9),
    };
  }

  get aguaLitros(): number {
    return +(this.peso * 0.035).toFixed(2); // 35ml/kg convertido para litros
  }
}
