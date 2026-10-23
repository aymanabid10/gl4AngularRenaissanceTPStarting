import { Directive, signal } from '@angular/core';

@Directive({
  selector: 'input[appRainbow]',
  host: {
    '[style.color]': 'color()',
    '[style.borderColor]': 'color()',
    '(keyup)': 'onKeyup()',
  },
})
export class RainbowDirective {
  color = signal('');

  onKeyup() {
    this.color.set(this.randomColor());
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
