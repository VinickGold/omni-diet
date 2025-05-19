import { Component, OnInit } from '@angular/core';
import { DataStorageService } from '../../services/data-storage.service';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import {CommonModule} from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WaterIntakeChartComponent } from '../water-intake-chart/water-intake-chart.component';
import { WaterEntry } from '../../models/models';


@Component({
  selector: 'app-water-intake',
  templateUrl: './water-intake.component.html',
  standalone: true,
  imports: [RouterModule, FormsModule , CommonModule , WaterIntakeChartComponent],
  providers: [DataStorageService],
})
export class WaterIntakeComponent implements OnInit {
  selectedDate: string = new Date().toISOString().split('T')[0];
  amount: number | null = null;
  time: string = '';
  waterIntakes: WaterEntry[] = [];
  filteredIntakes: WaterEntry[] = [];
  dailyGoal = 2000;


  constructor(private router: Router, private dataService: DataStorageService) {}
  
  ngOnInit() {
    this.loadData();
    
    // Set the current time as default for the time input
    const currentTime = new Date();
    this.time = `${currentTime.getHours().toString().padStart(2, '0')}:${currentTime.getMinutes().toString().padStart(2, '0')}`;
  }

  // goBack() {
  //   this.router.navigateByUrl('/');
  // }

  addWaterIntake() {
    if (this.amount && this.time) {
      const newEntry = new WaterEntry(this.amount, this.time, this.selectedDate); // Include the selected date
      this.waterIntakes.push(newEntry);
      this.waterIntakes = [...this.waterIntakes];
      this.updateFilteredData();
      this.saveData();
      this.amount = null;
      // this.time = '';
    }
  }

  onDateChangeFromChart(date: string) {
    console.log('ChartDateChange' , date);
    this.selectedDate = date;
  }

  addQuickWaterIntake() {
    const now = new Date();
    const formattedTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
    //const formattedDate = now.toISOString().split('T')[0]; // yyyy-mm-dd
    var formattedDate = this.selectedDate;

    const existingEntry = this.waterIntakes.find(entry =>
      entry.date === formattedDate && entry.time === formattedTime
    );
  
    if (existingEntry) {
      existingEntry.amount += 100;
    } else {
      const newEntry = new WaterEntry(100, formattedTime, formattedDate);
      this.waterIntakes.push(newEntry);
    }
  
    this.waterIntakes = [...this.waterIntakes]; // Trigger change detection if needed
    this.updateFilteredData();
    this.saveData();
  }

  deleteWaterIntake(entry: WaterEntry) {
    const index = this.waterIntakes.findIndex(e =>
      e.amount === entry.amount &&
      e.time === entry.time &&
      e.date === entry.date
    );

    if (index !== -1) {
      this.waterIntakes.splice(index, 1);
      this.updateFilteredData();
      this.saveData();
    }
  }

  saveData() {
    this.dataService.saveData(`water-intake`, this.waterIntakes);
  }

  loadData() {
    const data = this.dataService.loadData<WaterEntry[]>(`water-intake`);
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
