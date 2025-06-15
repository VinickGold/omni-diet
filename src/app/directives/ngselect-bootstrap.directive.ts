import {
  Directive,
  ElementRef,
  Renderer2,
  AfterViewInit,
  NgZone,
  OnDestroy,
  Host
} from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { fromEvent, Subscription } from 'rxjs';

@Directive({
  selector: '[bootstrapNgSelect]'
})
export class BootstrapNgSelectDirective implements AfterViewInit, OnDestroy {
  private openSub: Subscription | undefined;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private ngZone: NgZone,
    @Host() private ngSelect: NgSelectComponent
  ) {}

  ngAfterViewInit(): void {
    const container = this.el.nativeElement.querySelector('.ng-select-container');
    if (container) {
        this.renderer.addClass(container, 'form-control');
    }

    this.applyFormControlPaddingToInnerInput();

    this.openSub = this.ngSelect.openEvent.subscribe(() => {
        this.ngZone.runOutsideAngular(() => {
        requestAnimationFrame(() => {
            const panel = document.querySelector('.ng-dropdown-panel');
            if (panel) {
            this.applyBootstrapDropdownClasses(panel as HTMLElement);
            }
        });
        });
    });
    }

  private applyBootstrapDropdownClasses(panel: HTMLElement) {
    this.renderer.addClass(panel, 'bg-white');
    this.renderer.addClass(panel, 'border');
    this.renderer.addClass(panel, 'rounded');
    this.renderer.addClass(panel, 'shadow');
    this.renderer.addClass(panel, 'mt-1');
    this.renderer.addClass(panel, 'p-2');
  }

  private applyFormControlPaddingToInnerInput() {
    // Create a temporary element with Bootstrap's .form-control class
    const temp = this.renderer.createElement('input');
    this.renderer.addClass(temp, 'form-control');
    this.renderer.setStyle(temp, 'position', 'absolute');
    this.renderer.setStyle(temp, 'visibility', 'hidden');
    this.renderer.setStyle(temp, 'pointer-events', 'none');
    this.renderer.appendChild(document.body, temp);

    const computedStyles = getComputedStyle(temp);
    const paddingTop = computedStyles.paddingTop;
    const paddingRight = computedStyles.paddingRight;
    const paddingBottom = computedStyles.paddingBottom;
    const paddingLeft = computedStyles.paddingLeft;

    this.renderer.removeChild(document.body, temp);

    // Apply the padding to the ng-select's internal <input>
    const input = this.el.nativeElement.querySelector('input');
    if (input) {
        //this.renderer.setStyle(input, 'padding-top', paddingTop);
        //this.renderer.setStyle(input, 'padding-right', paddingRight);
        //this.renderer.setStyle(input, 'padding-bottom', paddingBottom);
        this.renderer.setStyle(input, 'padding-left', paddingLeft);
    }
    }

  ngOnDestroy(): void {
    this.openSub?.unsubscribe();
  }
}
