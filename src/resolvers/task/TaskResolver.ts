import { ResolverService } from "@tsed/typegraphql";
import { Arg, Mutation, Query } from "type-graphql";

import { Task } from "./Task";
import { CreateTask } from "./CreateTask";
import { UpdateTask } from "./UpdateTask";

import { TaskService } from "../../services/TaskService";
import { TaskNotFoundError } from "./TaskNotFoundError";

@ResolverService(Task)
export class TaskResolver {
  constructor(private taskService: TaskService) {}

  @Query(() => Task)
  async task(@Arg("id") id: string): Promise<Task> {
    const task = await this.taskService.findByID(id);
    if (!task) {
      throw new TaskNotFoundError(id);
    }

    return task;
  }

  @Query(() => [Task], {
    description: "Get all the Tasks from the database",
  })
  tasks(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Mutation(() => Task)
  async createTask(@Arg("task") task: CreateTask): Promise<Task> {
    return this.taskService.create(task);
  }

  @Mutation(() => Task)
  updateTask(
    @Arg("id") id: string,
    @Arg("to_update") to_update: UpdateTask
  ): Promise<Task> {
    return this.taskService.update(id, to_update);
  }

  @Mutation(() => Task)
  deleteTask(@Arg("id") id: string): Promise<Task> {
    return this.taskService.delete(id);
  }
}
