import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmbaucheService } from '../services/embauche.service';
import { Cv } from '../model/cv';
import { ItemComponent } from '../item/item.component';

@Component({
  selector: 'app-embauche',
  templateUrl: './embauche.component.html',
  styleUrls: ['./embauche.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [CommonModule, ItemComponent],
  standalone: true,
})
export class EmbaucheComponent {
  public embauchees: Cv[] = [];
  constructor(private embaucheService: EmbaucheService) {
    this.embauchees = this.embaucheService.getEmbauchees();
  }
}
