import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { CvComponent } from "./cv/cv.component";
import { AddCvComponent } from "./add-cv/add-cv.component";
import { DetailsCvComponent } from "./details-cv/details-cv.component";
import { authGuard } from "../auth/guards/auth.guard";

const routes: Route[] = [
  { path: "", component: CvComponent },
  { path: "add", component: AddCvComponent, canActivate: [authGuard] },
  { path: ":id", component: DetailsCvComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CvRoutingModule {}
