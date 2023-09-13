import { Injectable, Inject } from "@tsed/di";
import { Prisma, PrismaClient, TaskType } from "@prisma/client";

import { Schedule, ScheduleNotFoundError } from "../resolvers";
import { CreateSchedule } from "../resolvers/schedule/CreateSchedule";
import { UpdateSchedule } from "../resolvers/schedule/UpdateSchedule";

@Injectable()
export class ScheduleService {
  @Inject()
  private prisma: PrismaClient;

  /**
   * Finds a schedule by it's ID and returns it with all it's tasks.
   * @param {string} id The ID of the schedule to find
   * @returns {Promise<Schedule>} Returns the schedule object with all it's tasks.
   */
  async findByID(id: string): Promise<Schedule | null> {
    return this.prisma.schedule.findUnique({
      where: { id: id },
      include: {
        tasks: true,
      },
    });
  }

  /**
   * Finds all schedules by a where clause and returns an array of schedule objects.
   * @param where Optional where clause to filter schedules
   * @returns {Promise<Schedule[]>} Returns an array of schedule objects.
   */
  async findAll(where: Prisma.ScheduleWhereInput = {}): Promise<Schedule[]> {
    return this.prisma.schedule.findMany({
      where: where,
      include: {
        tasks: true,
      },
      orderBy: {
        start_time: "desc",
      },
    });
  }

  /**
   * Deletes a schedule by it's ID and returns the deleted schedule with all it's tasks.
   * @param {string} id The ID of the schedule to delete
   * @returns {Promise<Schedule>} Returns the deleted schedule object with all it's tasks or null if it does not exist.
   */
  async delete(id: string): Promise<Schedule> {
    return this.prisma.schedule.delete({
      where: { id },
      include: { tasks: true },
    });
  }

  /**
   * Creates a schedule and returns the created schedule with all it's tasks.
   * @param {string} input The schedule data to create
   * @returns {Promise<Schedule>} Returns the created schedule object with all it's tasks.
   */
  async create(input: CreateSchedule): Promise<Schedule> {
    const data: Prisma.ScheduleCreateInput = {
      ...input,
      tasks: undefined,
    };

    // create tasks if they exist
    if (input.tasks) {
      data.tasks = {
        createMany: {
          data: input.tasks?.map((task) => ({
            ...task,

            account_id: data.account_id,
            type: task.type as TaskType,
          })),
        },
      };
    }

    return this.prisma.schedule.create({
      data,
      include: {
        tasks: true,
      },
    });
  }

  /**
   * Updates a schedule by it's ID and returns the updated schedule with all it's tasks.
   * @param id The ID of the schedule to update
   * @param data  The data to update the schedule with
   * @returns {Promise<Schedule>} Returns the updated schedule object with all it's tasks.
   */
  async update(id: string, data: UpdateSchedule): Promise<Schedule> {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
    });

    if (!schedule) {
      throw new ScheduleNotFoundError(id);
    }

    return this.prisma.schedule.update({
      where: { id },
      include: { tasks: true },
      data: {
        ...data,
        tasks: {
          upsert: data.tasks?.map((task) => ({
            where: { id: task.id },
            create: {
              ...task,
              type: task.type as TaskType,
              account_id: schedule.account_id,
            },
            update: {
              ...task,
              type: task.type as TaskType,
              account_id: data.account_id,
            },
          })),
        },
      },
    });
  }
}
