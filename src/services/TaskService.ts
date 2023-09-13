import { Injectable, Inject } from "@tsed/di";
import { Prisma, PrismaClient, TaskType } from "@prisma/client";

import { ScheduleNotFoundError, Task } from "../resolvers";
import { UpdateTask } from "../resolvers/task/UpdateTask";
import { CreateTask } from "../resolvers/task/CreateTask";

@Injectable()
export class TaskService {
  @Inject()
  private prisma: PrismaClient;

  /**
   * Finds a task by it's ID and returns it with it's schedule.
   * @param id The ID of the task to find
   * @returns {Promise<Task>} Returns the task object with it's schedule.
   */
  async findByID(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({
      where: { id: id },
      include: { schedule: true },
    });
  }

  /**
   * Finds all tasks by a where clause and returns an array of task objects.
   * @param where Optional where clause to filter tasks
   * @returns {Promise<Task[]>} Returns an array of task objects.
   */
  async findAll(where: Prisma.TaskWhereInput = {}): Promise<Task[]> {
    return this.prisma.task.findMany({
      where: where,
      include: {
        schedule: true,
      },
      orderBy: {
        schedule: {
          start_time: "desc",
        },
      },
    });
  }

  /**
   * Deletes a task by it's ID and returns the deleted task with it's schedule.
   * @param id
   * @returns {Promise<Task>} Returns the deleted task object with it's schedule or null if it does not exist.
   */
  async delete(id: string): Promise<Task> {
    return this.prisma.task.delete({
      where: { id },
      include: { schedule: true },
    });
  }

  /**
   * Creates a task and returns it with it's schedule.
   * @param input The task input to create
   * @returns {Promise<Task>} Returns the created task object with it's schedule.
   */
  async create(input: CreateTask): Promise<Task> {
    return this.prisma.$transaction(async (prisma) => {
      const schedule = await prisma.schedule.findUnique({
        where: { id: input.schedule_id },
      });

      if (!schedule) {
        throw new ScheduleNotFoundError(input.schedule_id);
      }

      const data: Prisma.TaskCreateInput = {
        account_id: schedule.account_id,
        type: input.type as TaskType,
        schedule: {
          // explicitly don't allow schedule to be created here
          connect: {
            id: input.schedule_id,
          },
        },
      };

      return prisma.task.create({
        data,
        include: { schedule: true },
      });
    });
  }

  /**
   * Updates a task and returns it with it's schedule.
   * @param id The ID of the task to update
   * @param data The data to update the task with
   * @returns {Promise<Task>} Returns the updated task object with it's schedule.
   */
  async update(id: string, data: UpdateTask): Promise<Task> {
    return this.prisma.task.update({
      where: { id },
      include: { schedule: true },
      data: {
        ...data,
        type: data.type as TaskType,
      },
    });
  }
}
