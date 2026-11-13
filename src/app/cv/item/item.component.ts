import { Component, Input, ChangeDetectionStrategy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Cv } from "../model/cv";
import { CvService } from "../services/cv.service";
import { DefaultImagePipe } from "../pipes/default-image.pipe";

@Component({
  selector: "app-item",
  templateUrl: "./item.component.html",
  styleUrls: ["./item.component.css"],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, DefaultImagePipe],
  standalone: true,
})
export class ItemComponent {
  @Input({ required: true }) cv!: Cv;
  @Input() size = 50;
  constructor(private cvService: CvService) {}

  onSelectCv() {
    this.cvService.selectCv(this.cv);
  }
}
