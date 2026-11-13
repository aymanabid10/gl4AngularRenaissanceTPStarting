import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { EmbaucheService } from '../services/embauche.service';
import { Cv } from '../model/cv';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-embauche',
  templateUrl: './embauche.component.html',
  styleUrls: ['./embauche.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ItemComponent],
  standalone: true,
})
export class EmbaucheComponent {
  embauchees$: Observable<Cv[]>;
  get embauchees(): Cv[] {
    return this.embaucheService.getEmbauchees();
  }
  constructor(private embaucheService: EmbaucheService) {
    this.embauchees$ = this.embaucheService.embauchees$;
  }
}
