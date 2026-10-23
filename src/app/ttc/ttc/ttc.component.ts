import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

const QUANTITE_MIN_REMISE = 10;
const QUANTITE_MAX_REMISE = 15;
const TAUX_REMISE_PALIER_1 = 20;

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

  readonly totalAvantRemise = computed(
    () => this.prixUnitaireTtc() * this.quantite()
  );

  readonly tauxRemise = computed(() => {
    const quantite = this.quantite();
    if (quantite >= QUANTITE_MIN_REMISE && quantite <= QUANTITE_MAX_REMISE) {
      return TAUX_REMISE_PALIER_1;
    }
    return 0;
  });

  readonly montantRemise = computed(
    () => (this.totalAvantRemise() * this.tauxRemise()) / 100
  );

  readonly totalTtc = computed(
    () => this.totalAvantRemise() - this.montantRemise()
  );
}
