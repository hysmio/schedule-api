import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns } from "@tsed/schema";
import { Task, TaskResolver } from "../../../resolvers";
import { CreateTask } from "../../../resolvers/task/CreateTask";
import { UpdateTask } from "../../../resolvers/task/UpdateTask";

@Controller("/task")
export class TaskController {
  @Inject()
  private resolver: TaskResolver;

  @Get("/")
  @Returns(200, Array).Of(Task)
  getTasks(): Promise<Task[]> {
    return this.resolver.tasks();
  }

  @Get("/:task_id")
  @Returns(200, Task)
  getTask(@PathParams("task_id") task_id: string): Promise<Task> {
    return this.resolver.task(task_id);
  }

  @Post("/")
  @Returns(201, Task)
  createTask(@BodyParams() task: CreateTask): Promise<Task> {
    return this.resolver.createTask(task);
  }

  @Put("/:task_id")
  @Returns(200, Task)
  updateTask(
    @PathParams("task_id") task_id: string,
    @BodyParams() to_update: UpdateTask
  ): Promise<Task> {
    return this.resolver.updateTask(task_id, to_update);
  }

  @Delete("/:task_id")
  @Returns(200, Task)
  deleteTask(@PathParams("task_id") task_id: string): Promise<Task> {
    return this.resolver.deleteTask(task_id);
  }
}
