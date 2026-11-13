import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { AdminRoutingModule } from "./admin-routing.module";
import { AdminComponent } from "./admin/admin.component";
import { ColorComponent } from "../components/color/color.component";

@NgModule({
  declarations: [AdminComponent, ColorComponent],
  imports: [CommonModule, FormsModule, AdminRoutingModule],
})
export class AdminModule {}

