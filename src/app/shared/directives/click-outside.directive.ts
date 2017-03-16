import { Directive, ElementRef, HostListener, EventEmitter, Output } from '@angular/core';

/**
 * Directive used to call a method when clicked outside of an element.
 *
 * This is useful when trying to close a menu.
 */
@Directive({
  selector: '[appClickOutside]'
})
export class ClickOutsideDirective {

  @Output()
  public appClickOutside = new EventEmitter();

  constructor(private _elementRef: ElementRef) { }

  @HostListener('document:click', ['$event.target'])
  public onClick(targetElement) {
    const clickedInside = this._elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.appClickOutside.emit(null);
    }
  }
}
