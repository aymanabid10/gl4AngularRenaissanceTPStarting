import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cv } from "../model/cv";
import { ItemComponent } from "../item/item.component";

@Component({
  selector: "app-list",
  templateUrl: "./list.component.html",
  styleUrls: ["./list.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ItemComponent],
  standalone: true,
})
export class ListComponent {
  @Input() cvs: Cv[] | null = [];
}
