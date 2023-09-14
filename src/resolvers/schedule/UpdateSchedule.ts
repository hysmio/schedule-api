import { Field, Int, InputType } from "type-graphql";
import { ArrayOf, Description, Example, Minimum } from "@tsed/schema";
import { AfterDeserialize } from "@tsed/json-mapper";
import { ValidationError } from "@tsed/platform-params";

import { UpdateTask } from "../task/UpdateTask";

// Hacky but I couldn't get validation via `class-validator` to work.
@AfterDeserialize((update_data: UpdateSchedule) => {
  if (update_data.start_time && update_data.start_time < new Date()) {
    throw new ValidationError(
      `Bad request on parameter "request.body".\nUpdateSchedule.start_date must NOT be in the past. Given value: ${update_data.start_time.toISOString()}`,
      [
        {
          message: "must not be in the past",
          instancePath: "/start_time",
          dataPath: ".start_time",
        },
      ]
    );
  }
  return update_data;
})
@InputType()
export class UpdateSchedule {
  @Field(() => Int, { nullable: true })
  @Description("The ID of the account this schedule belongs to")
  @Minimum(1)
  @Example(123)
  account_id?: number;

  @Field(() => Date, { nullable: true })
  @Description("The time at which the schedule should start")
  @Example("2023-01-01T00:00:00.000Z")
  start_time?: Date;

  @Field(() => [UpdateTask], { nullable: true })
  @Description("The tasks to execute at start_time")
  @ArrayOf(UpdateTask)
  tasks?: UpdateTask[];
}
