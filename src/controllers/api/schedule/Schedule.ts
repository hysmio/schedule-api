import { Controller, Inject } from "@tsed/di";
import { BodyParams, PathParams } from "@tsed/platform-params";
import { Delete, Get, Post, Put, Returns } from "@tsed/schema";

import { Schedule, ScheduleResolver } from "../../../resolvers";
import { CreateSchedule } from "../../../resolvers/schedule/CreateSchedule";
import { UpdateSchedule } from "../../../resolvers/schedule/UpdateSchedule";

@Controller("/schedule")
export class ScheduleController {
  @Inject()
  private resolver: ScheduleResolver;

  @Get("/")
  @Returns(200, Array).Of(Schedule).Groups("with.tasks")
  getSchedules(): Promise<Schedule[]> {
    return this.resolver.schedules();
  }

  @Get("/:schedule_id")
  @Returns(200, Schedule).Groups("with.tasks")
  getSchedule(
    @PathParams("schedule_id") schedule_id: string
  ): Promise<Schedule> {
    return this.resolver.schedule(schedule_id);
  }

  @Post("/")
  @Returns(201, Schedule).Groups("with.tasks")
  createSchedule(@BodyParams() schedule: CreateSchedule): Promise<Schedule> {
    return this.resolver.createSchedule(schedule);
  }

  @Put("/:schedule_id")
  @Returns(200, Schedule).Groups("with.tasks")
  updateSchedule(
    @PathParams("schedule_id") schedule_id: string,
    @BodyParams() to_update: UpdateSchedule
  ): Promise<Schedule> {
    return this.resolver.updateSchedule(schedule_id, to_update);
  }

  @Delete("/:schedule_id")
  @Returns(200, Schedule).Groups("with.tasks")
  deleteSchedule(
    @PathParams("schedule_id") schedule_id: string
  ): Promise<Schedule> {
    return this.resolver.deleteSchedule(schedule_id);
  }
}
