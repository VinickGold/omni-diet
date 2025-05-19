import { DataStorageService } from '../../services/data-storage.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import {CommonModule} from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-water-intake-chart',
  templateUrl: './water-intake-chart.component.html',
  styleUrl: './water-intake-chart.component.css',
  standalone: true,
  imports: [RouterModule, FormsModule , CommonModule ],
  providers: [DataStorageService],
})
export class WaterIntakeChartComponent implements OnChanges {

  @Input() selectedDate: string = new Date().toISOString().split('T')[0];
  @Input() waterEntries: { amount: number; date: string }[] = [];
  @Input() waterGoal: number = 2000;
  @Output() dateSelected = new EventEmitter<string>();

  viewMode: 'week' | 'month' = 'week';
  displayDays: string[] = [];
  dailyTotals: { [date: string]: number } = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['waterEntries'] || changes['selectedDate']) {
      this.updateChart();
    }
  }

  changeViewMode(mode: 'week' | 'month') {
    this.viewMode = mode;
    this.updateChart();
  }

  onDateClicked(date: string) {
    console.log('date clicked');
    this.dateSelected.emit(date);
  }

  updateChart() {

    console.log('update');
    // const baseDate = new Date(this.selectedDate);
    const [year, month, day] = this.selectedDate.split('-').map(Number);
    const baseDate = new Date(year, month - 1, day); // Cria em fuso local
    let startDate: Date;
  
    if (this.viewMode === 'week') {
      const dayOfWeek = baseDate.getDay(); // 0=Sunday
      const diffToMonday = (dayOfWeek + 6) % 7;
      startDate = new Date(baseDate);
      startDate.setDate(baseDate.getDate() - diffToMonday);
    } else {
      startDate = new Date(baseDate.getFullYear(), baseDate.getMonth(), 1);
    }

    console.log('Claculated Date' , startDate);
  
    const daysToShow = this.viewMode === 'week' ? 7 : 30;
    this.dailyTotals = {};
  
    for (let i = 0; i < daysToShow; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      const dateStr = this.toLocalDateString(date);
      this.dailyTotals[dateStr] = 0;
    }
  
    for (const entry of this.waterEntries) {
      if (this.dailyTotals.hasOwnProperty(entry.date)) {
        this.dailyTotals[entry.date] += entry.amount;
      }
    }
  
    this.displayDays = Object.keys(this.dailyTotals);
  }

  getBarWidth(date: string): string {
    const total = this.dailyTotals[date] || 0;
    const pct = Math.min((total / this.waterGoal) * 100, 100);
    return pct + '%';
  }

  todayStr(): string {
    return new Date().toISOString().split('T')[0];
  }

  toLocalDateString(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
}
