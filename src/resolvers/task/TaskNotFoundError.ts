import { NotFound } from "@tsed/exceptions";

export class TaskNotFoundError extends NotFound {
  constructor(private id: string) {
    super("Task not found");
  }
}
