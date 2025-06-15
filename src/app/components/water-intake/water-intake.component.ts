import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import {CommonModule} from '@angular/common';
import { WaterIntakeChartComponent } from '../water-intake-chart/water-intake-chart.component';
import { ProfileData, WaterEntry } from '../../models/models';

@Component({
  selector: 'app-water-intake',
  templateUrl: './water-intake.component.html',
  standalone: true,
  imports: [FormsModule , CommonModule , WaterIntakeChartComponent],
  providers: [DataStorageService],
})
export class WaterIntakeComponent implements OnInit 
{
  selectedDate: string = new Date().toLocaleDateString('sv-SE');
  amount: number | null = null;
  time: string = '';
  waterIntakes: WaterEntry[] = [];
  filteredIntakes: WaterEntry[] = [];
  dailyGoal = 2000;
  sensitivityLevel: number = 1;
  sensitivityValue: number = 100;

  constructor(private dataService: DataStorageService ) {} 
  
  ngOnInit() 
  {
    this.loadData();
    // Set the current time as default for the time input
    const currentTime = new Date();
    this.time = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
  }

  onDateChangeFromChart(date: string) 
  {
    console.log('ChartDateChange' , date);
    this.selectedDate = date;
  }

  adjustWaterIntake(amount: number) 
  {
    if (this.validateFutureDate()) {
      window.alert(`Atenção\n\nNão é permitido efetuar registros em dias futuros`);
      return;
    }

    const date = this.selectedDate;
    let entry = this.waterIntakes.find(e => e.date === date);

    if (!entry) {
      if (amount > 0) {
        this.waterIntakes.push(new WaterEntry(amount, '--:--', date)); // You can leave time blank or use a placeholder
      }
      // If amount is negative and no entry exists, do nothing
    } else {
      entry.amount += amount;

      if (entry.amount <= 0) {
        this.waterIntakes = this.waterIntakes.filter(e => e !== entry);
      }
    }

    this.waterIntakes = [...this.waterIntakes]; // Trigger change detection
    this.updateFilteredData();
    this.saveData();
  }

  validateFutureDate() : boolean
  {
    return new Date(this.selectedDate) > new Date()
  }

  saveData() {
    this.dataService.saveData(`water-intake`, this.waterIntakes);
    
  }

  updateSensitivity() {
    this.sensitivityValue = 50 + Math.round(this.sensitivityLevel) * 50;
    this.dataService.saveData(`water-value` , this.sensitivityLevel);
  }

  loadData() {
    const data = this.dataService.loadData<WaterEntry[]>(`water-intake`);
    const profile = this.dataService.loadData<ProfileData>(`profileData`);
    this.sensitivityLevel = this.dataService.loadData<number>(`water-value`) || 0;
    this.updateSensitivity();
    
    this.dailyGoal = profile?.waterGoal ?? 2000;
    this.waterIntakes = data ?? []; // Filter entries by date
     
    // Sort the entries by date in descending order
    this.waterIntakes.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`).getTime(); // Combine date and time to get a full timestamp
      const dateB = new Date(`${b.date}T${b.time}`).getTime(); // Combine date and time to get a full timestamp
      return dateB - dateA; // Sort in descending order (latest first)
    });

    this.updateFilteredData();
  }

  getTotalWaterIntake(): number {
    return this.filteredIntakes.reduce((total, entry) => total + entry.amount, 0); // Sum the amounts
  }

  updateFilteredData()
  {
    this.filteredIntakes = this.waterIntakes.filter(entry => entry.date === this.selectedDate)
  }
}
