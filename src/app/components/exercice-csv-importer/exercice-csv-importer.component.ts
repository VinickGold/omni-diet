import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Exercise } from '../../models/models';

@Component({
  selector: 'app-exercise-csv-import',
  standalone: true,
  imports: [CommonModule],
  
  templateUrl: './exercice-csv-importer.component.html'
})
export class ExerciseCsvImportComponent {
  @Output() exercisesImported = new EventEmitter<Exercise[]>();

  onFileChange(event: Event) {

    console.log('file-change');
    const input = event.target as HTMLInputElement;
    const file = input?.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const lines = text.split('\n').filter(line => line.trim().length > 0);
      const result: Exercise[] = [];

      for (const line of lines.slice(1)) { // Ignora o cabeçalho
        const [name, calories, date] = line.split(',').map(s => s.trim());
        if (name && calories && date) {


          var entry = {
            name,
            calories: parseFloat(calories),
            date: new Date(date)
          };

          console.log(entry);

          result.push(entry);
        }
      }

      console.log('EMISSÂO DO EVENTO')
      console.log(result);
      this.exercisesImported.emit(result);
    };

    reader.readAsText(file);
  }
}