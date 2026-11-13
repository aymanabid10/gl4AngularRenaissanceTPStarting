import { Component, ChangeDetectionStrategy } from '@angular/core';
import { EmbaucheService } from '../services/embauche.service';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-embauche',
  templateUrl: './embauche.component.html',
  styleUrls: ['./embauche.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ItemComponent],
  standalone: true,
})
export class EmbaucheComponent {
  embauchees = this.embaucheService.embauchees;

  constructor(private embaucheService: EmbaucheService) {}
}
