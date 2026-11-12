import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";

import { TodoRoutingModule } from "./todo-routing.module";
import { TodoComponent } from "./todo/todo.component";

@NgModule({
  declarations: [TodoComponent],
  imports: [CommonModule, FormsModule, TodoRoutingModule],
})
export class TodoModule {}

