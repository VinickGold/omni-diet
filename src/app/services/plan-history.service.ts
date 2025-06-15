import { Injectable } from '@angular/core';
import { DataStorageService } from './data-storage.service';
import { DayPlan , DailyPlanSnapshot  } from '../models/models';



@Injectable({ providedIn: 'root' })
export class PlanHistoryService {
  private readonly STORAGE_PREFIX = 'plan-history-';
  private readonly DATE_INDEX_KEY = 'plan-history-dates';

  constructor(private dataStorage: DataStorageService) {}

  /**
   * Congela planos passados com base no planejamento semanal (DayPlan por dia da semana: 0 = Domingo, ..., 6 = Sábado)
   */
  // freezeMissingPlansIfNeeded(weeklyPlans: DayPlan[]): void {
  freezeMissingPlansIfNeeded(): void {

    console.log('Fazendo backup dos planos de refeição atuais');

    const weeklyPlans = this.dataStorage.loadData<DayPlan[]>('meal-plans') || [];
    const today = this.getDateString(new Date());
    const storedDates = this.getStoredDates();

    const datesToSave: string[] = [];

    const lastStoredDate = storedDates.length
      ? storedDates.sort().slice(-1)[0]
      : this.getDateString(this.addDays(new Date(), -6));

    let current = this.addDays(new Date(lastStoredDate), 1);

    while (this.getDateString(current) <= today) {
      const dateStr = this.getDateString(current);
      if (!storedDates.includes(dateStr)) {
        const weekdayIndex = current.getDay();
        const basePlan = weeklyPlans[weekdayIndex];

        // Skip if there's no plan for this weekday
        if (!basePlan) {
          console.warn(`No plan defined for weekday ${weekdayIndex} (${dateStr}), skipping.`);
          current = this.addDays(current, 1);
          continue;
        }

        const planned: DayPlan = this.deepClone(basePlan);
        planned.day = dateStr;

        const newRecord: DailyPlanSnapshot = {
          date: dateStr,
          planned,
        };

        this.dataStorage.saveData(this.key(dateStr), newRecord);
        datesToSave.push(dateStr);
      }

      current = this.addDays(current, 1);
    }

    if (datesToSave.length > 0) {
      const updatedDates = [...storedDates, ...datesToSave];
      this.dataStorage.saveData(this.DATE_INDEX_KEY, updatedDates);
    }
  }

  getPlan(date: string): DailyPlanSnapshot | null {
    return this.dataStorage.loadData<DailyPlanSnapshot>(this.key(date));
  }

  /**
   * Salva a parte executada de um plano sem sobrescrever a parte planejada
   */
  saveExecutedPlan(date: string, executed: DayPlan): void {
    const plan = this.getPlan(date);
    if (!plan) {
      console.warn(`Nenhum plano salvo para ${date}`);
      return;
    }

    plan.executed = this.deepClone(executed);
    this.dataStorage.saveData(this.key(date), plan);
  }

  getAllHistory(): DailyPlanSnapshot[] {
    const storedDates = this.getStoredDates();
    const history: DailyPlanSnapshot[] = [];

    for (const date of storedDates) {
      const plan = this.getPlan(date);
      if (plan) history.push(plan);
    }

    return history.sort((a, b) => a.date.localeCompare(b.date));
  }

  // --------------------------------------------------------------------------------

  private getStoredDates(): string[] {
    return this.dataStorage.loadData<string[]>(this.DATE_INDEX_KEY) || [];
  }

  private key(date: string): string {
    return `${this.STORAGE_PREFIX}${date}`;
  }

  private getDateString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private addDays(date: Date, days: number): Date {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + days);
    return copy;
  }

  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}
