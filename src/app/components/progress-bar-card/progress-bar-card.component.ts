import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-progress-bar-card',
  templateUrl: './progress-bar-card.component.html',
  imports: [CommonModule , FormsModule]
})
export class ProgressBarCardComponent {
  @Input() label!: string;
  @Input() current!: number;
  @Input() goal!: number;
  @Input() unit: string = '';
  @Input() decimalDigits: string = '1.1-1';
  @Input() successColor: string = 'bg-success';
  @Input() dangerColor: string = 'bg-danger';

  get percentage(): number {
    return Math.min((this.current / this.goal) * 100, 100);
  }

  get barClass(): string {
    return this.current <= this.goal ? this.successColor : this.dangerColor;
  }
}