import { NgModule } from "@angular/core";
import { RouterModule, Route } from "@angular/router";
import { TodoComponent } from "./todo/todo.component";

const routes: Route[] = [
  { path: "", component: TodoComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TodoRoutingModule {}

