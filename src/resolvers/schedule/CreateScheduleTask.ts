import { Field, InputType } from "type-graphql";
import { Description, Enum, Example, Required } from "@tsed/schema";

import { Task } from "..";

@InputType()
export class CreateScheduleTask {
  @Field(() => String)
  @Description(
    "The type of task, either 'break' or 'work', which determines the type of activity"
  )
  @Required()
  @Example("break")
  @Enum("break", "work")
  type: Task["type"];
}
