import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core'
import { NgModel } from '@angular/forms'

/**
 * Tranforma string de inputs donde se usa, elminando espacios posteriores.
 */
@Directive({ selector: '[appTrimSpaces]' })
export class TrimDirective {
  public constructor(
    private readonly renderer: Renderer2,
    private readonly elementRef: ElementRef,
    private readonly ngModel: NgModel,
  ) {}

  @HostListener('blur')
  public onBlur(): void {
    let value = this.ngModel.model

    if (value) {
      value = value.trim()
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', value)
      this.renderer.setAttribute(this.elementRef.nativeElement, 'value', value)
      this.ngModel.update.emit(value)
    } else {
      this.renderer.setProperty(this.elementRef.nativeElement, 'value', null)
      this.renderer.setAttribute(this.elementRef.nativeElement, 'value', '')
      this.ngModel.update.emit('')
    }
  }
}
