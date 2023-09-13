import { Field, InputType } from "type-graphql";
import { Description, Enum, Example, Pattern, Required } from "@tsed/schema";

import { UUIDRegex } from "../../helpers/constants";

@InputType()
export class CreateTask {
  @Field(() => String)
  @Description("The ID of the schedule this task belongs to")
  @Required()
  @Pattern(UUIDRegex)
  schedule_id: string;

  @Field(() => String)
  @Description(
    "The type of task, either 'break' or 'work', which determines the type of activity"
  )
  @Required()
  @Example("break")
  @Enum("break", "work")
  type: string;
}
