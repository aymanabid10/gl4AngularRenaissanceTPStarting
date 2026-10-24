import { Component, ChangeDetectionStrategy, input } from "@angular/core";
import { Cv } from "../model/cv";
import { NgClass } from "@angular/common";
import { ItemComponent } from "../item/item.component";

@Component({
    selector: "app-list",
    templateUrl: "./list.component.html",
    styleUrls: ["./list.component.css"],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [NgClass, ItemComponent]
})
export class ListComponent {
  cvs=input.required<Cv[]>();
}
