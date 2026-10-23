import { Directive, HostBinding, HostListener } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
  standalone: false,
})
export class RainbowDirective {
  @HostBinding('style.color')
  @HostBinding('style.borderColor')
  color = '';

  @HostListener('keyup') onKeyup() {
    this.color = this.randomColor();
  }

  private randomColor() {
    return (
      '#' +
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .padStart(6, '0')
    );
  }
}
