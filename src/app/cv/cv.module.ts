import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { CvRoutingModule } from "./cv-routing.module";
import { AddCvComponent } from "./add-cv/add-cv.component";
import { DetailsCvComponent } from "./details-cv/details-cv.component";
import { AutocompleteComponent } from "./autocomplete/autocomplete.component";

import { CvComponent } from "./cv/cv.component";
import { ListComponent } from "./list/list.component";
import { CvCardComponent } from "./cv-card/cv-card.component";
import { ItemComponent } from "./item/item.component";
import { DefaultImagePipe } from "./pipes/default-image.pipe";

@NgModule({
  declarations: [
    AddCvComponent,
    DetailsCvComponent,
    AutocompleteComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    CvRoutingModule,
    CvComponent,
    ListComponent,
    CvCardComponent,
    ItemComponent,
    DefaultImagePipe,
  ],
})
export class CvModule {}
