import { Component, ChangeDetectionStrategy, inject, effect } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { TodoService } from '../service/todo.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-todo',
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  providers: [TodoService],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FormsModule],
})
export class TodoComponent {
  private todoService = inject(TodoService);

  // les signaux utilisees
  todos = this.todoService.todos;
  waitingTodos = this.todoService.waitingTodos;
  inProgressTodos = this.todoService.inProgressTodos;
  doneTodos = this.todoService.doneTodos;

  todo = new Todo();

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {

    effect(() => {
      console.log('--- [Effect] Todos Signal Update ---');
      console.log('Total:', this.todos().length);
      console.log('Waiting:', this.waitingTodos());
      console.log('In Progress:', this.inProgressTodos());
      console.log('Done:', this.doneTodos());
    });
  }

  addTodo(): void {
    if (!this.todo.name.trim() || !this.todo.content.trim()) {
      return;
    }
    this.todoService.addTodo(this.todo);
    this.todo = new Todo();
  }

  changeStatus(id: number, newStatus: TodoStatus): void {
    this.todoService.updateStatus(id, newStatus);
  }

  deleteTodo(id: number): void {
    this.todoService.deleteTodo(id);
  }
}
