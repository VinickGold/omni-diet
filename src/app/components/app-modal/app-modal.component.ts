import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  Output,
  EventEmitter,
  Input,
  ContentChild,
  AfterContentInit
} from '@angular/core';
import { Modal } from 'bootstrap';

@Component({
  selector: 'app-modal',
  templateUrl: './app-modal.component.html',
  imports: [CommonModule]
})
export class Modal22Component implements AfterViewInit , AfterContentInit {
  // @ViewChild('modalElement') modalElementRef!: ElementRef;
  // private modalInstance!: Modal;

  @Input() modalId = '';
  @Input() title = '';
  @Output() submit = new EventEmitter<void>();

  isVisible: boolean = false;

  @ContentChild('modalFooter') customFooter!: ElementRef;
  hasCustomFooter = false;

  ngAfterContentInit(): void {
    this.hasCustomFooter = !!this.customFooter;
  }

  ngAfterViewInit(): void {
    //this.modalInstance = Modal.getOrCreateInstance(this.modalElementRef.nativeElement); // new Modal(this.modalElementRef.nativeElement);
  }

  open(): void {
    //this.modalInstance?.show();
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
    // this.modalInstance?.hide();
  }

  onSubmit(): void {
    this.submit.emit();
  }
}
