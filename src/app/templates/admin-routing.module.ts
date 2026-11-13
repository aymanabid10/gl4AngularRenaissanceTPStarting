import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { AdminComponent } from "./admin/admin.component";
import { ColorComponent } from "../components/color/color.component";

const routes: Route[] = [
  {
    path: "",
    component: AdminComponent,
    children: [{ path: "color", component: ColorComponent }],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}

