import { Field, InputType, Int } from "type-graphql";
import { AfterDeserialize } from "@tsed/json-mapper";
import { ValidationError } from "@tsed/platform-params";
import {
  Description,
  Example,
  Format,
  Minimum,
  Required,
  MinItems,
  ArrayOf,
} from "@tsed/schema";

import { CreateScheduleTask } from "./CreateScheduleTask";

// Hacky but I couldn't get validation via `class-validator` to work.
@AfterDeserialize((create_data: CreateSchedule) => {
  if (create_data.start_time < new Date()) {
    throw new ValidationError(
      `Bad request on parameter "request.body".\nCreateSchedule.start_date must NOT be in the past. Given value: ${create_data.start_time.toISOString()}`,
      [
        {
          message: "must not be in the past",
          instancePath: "/start_time",
          dataPath: ".start_time",
        },
      ]
    );
  }
  return create_data;
})
@InputType()
export class CreateSchedule {
  @Field(() => Int)
  @Required()
  @Minimum(1)
  @Example(123)
  account_id: number;

  @Field(() => String)
  @Description("The time at which the schedule should start")
  @Required()
  @Format("date-time")
  @Example("2023-01-01T00:00:00.000Z")
  start_time: Date;

  @Field(() => [CreateScheduleTask])
  @Description("The tasks to execute at start_time")
  @MinItems(1)
  @ArrayOf(CreateScheduleTask)
  @Required()
  tasks: CreateScheduleTask[];
}
