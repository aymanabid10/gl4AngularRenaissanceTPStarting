import { Injectable, inject, signal, computed } from '@angular/core';
import { Todo, TodoStatus } from '../model/todo';
import { LoggerService } from '../../services/logger.service';

let n = 3;

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private loggerService = inject(LoggerService);

  readonly todos = signal<Todo[]>([
    new Todo(1, 'TODO #1', 'task 1', 'waiting'),
    new Todo(2, 'TODO #2', 'task 2', 'in progress'),
    new Todo(3, 'TODO #3', 'task 3', 'done'),
  ]);

  readonly waitingTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'waiting')
  );

  readonly inProgressTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'in progress')
  );

  readonly doneTodos = computed(() =>
    this.todos().filter((todo) => todo.status === 'done')
  );

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);
  constructor() {}

  /**
   * elle retourne la liste des todos
   *
   * @returns Todo[]
   */
  getTodos() {
    return this.todos;
  }

  /**
   *Elle permet d'ajouter un todo
   *
   * @param todo: Todo
   *
   */
  addTodo(todo: Todo): void {
    const newId = todo.id ? todo.id : ++n;
    const newTodo = new Todo(
      newId,
      todo.name,
      todo.content,
      todo.status || 'waiting'
    );
    this.todos.update((current) => [...current, newTodo]);
    this.loggerService.logger(this.todos());
  }

  /**
   * Met a jour le statut d un todo
   */
  updateStatus(id: number, newStatus: TodoStatus): void {
    this.todos.update((current) =>
      current.map((t) => (t.id === id ? new Todo(t.id, t.name, t.content, newStatus) : t))
    );
    this.loggerService.logger(this.todos());
  }

  /**
   * Supprime un todo
   */
  deleteTodo(id: number): boolean {
    const initialLength = this.todos().length;
    this.todos.update((current) => current.filter((t) => t.id !== id));
    this.loggerService.logger(this.todos());
    return this.todos().length < initialLength;
  }

  /**
   * Logger la liste des todos
   */
  logTodos(): void {
    this.loggerService.logger(this.todos());
  }
}
