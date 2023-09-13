import { ResolverService } from "@tsed/typegraphql";
import { Arg, Mutation, Query } from "type-graphql";
import { Inject } from "@tsed/di";

import { Schedule } from "./Schedule";
import { CreateSchedule } from "./CreateSchedule";
import { UpdateSchedule } from "./UpdateSchedule";

import { ScheduleService } from "../../services/ScheduleService";
import { ScheduleNotFoundError } from "./ScheduleNotFoundError";

@ResolverService(Schedule)
export class ScheduleResolver {
  @Inject()
  private scheduleService: ScheduleService;

  @Query(() => Schedule)
  async schedule(@Arg("id") id: string) {
    const schedule = await this.scheduleService.findByID(id);
    if (!schedule) {
      throw new ScheduleNotFoundError(id);
    }

    return schedule;
  }

  @Query(() => [Schedule], {
    description: "Get all Schedules",
  })
  schedules(): Promise<Schedule[]> {
    return this.scheduleService.findAll();
  }

  @Mutation(() => Schedule)
  createSchedule(@Arg("schedule") schedule: CreateSchedule): Promise<Schedule> {
    return this.scheduleService.create(schedule);
  }

  @Mutation(() => Schedule)
  updateSchedule(
    @Arg("id") id: string,
    @Arg("to_update") to_update: UpdateSchedule
  ): Promise<Schedule> {
    return this.scheduleService.update(id, to_update);
  }

  @Mutation(() => Schedule)
  deleteSchedule(@Arg("id") id: string): Promise<Schedule> {
    return this.scheduleService.delete(id);
  }
}
