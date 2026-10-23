import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ttc',
  templateUrl: './ttc.component.html',
  styleUrls: ['./ttc.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule, DecimalPipe],
})
export class TtcComponent {
  readonly prixHt = signal(0);
  readonly quantite = signal(1);
  readonly tva = signal(18);

  readonly prixUnitaireTtc = computed(
    () => this.prixHt() * (1 + this.tva() / 100)
  );

  readonly totalTtc = computed(
    () => this.prixUnitaireTtc() * this.quantite()
  );
}
