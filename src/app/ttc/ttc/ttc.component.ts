import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ttc',
  templateUrl: './ttc.component.html',
  styleUrls: ['./ttc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class TtcComponent {
  readonly prixHt = signal(0);
  readonly quantite = signal(1);
  readonly tva = signal(18);
}
