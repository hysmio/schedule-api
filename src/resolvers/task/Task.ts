import { Field, ID, ObjectType, Int } from "type-graphql";
import { Schedule } from "../schedule/Schedule";
import {
  Description,
  Enum,
  Example,
  Minimum,
  Pattern,
  Required,
} from "@tsed/schema";

import { UUIDRegex } from "../../helpers/constants";

@ObjectType({
  description: "A task which is to be executed as part of a schedule",
})
export class Task {
  @Field(() => ID)
  @Description("The ID of this task")
  @Required()
  @Pattern(UUIDRegex)
  id: string;

  // NOTE: number isn't specified in the schema, but Swagger refuses to display
  // it as a number, so we need to give it an obscure type to make it work.
  //
  // @Schema({ type: "number" }) also doesn't work :(
  @Field(() => Int)
  @Description("The ID of the account this task belongs to")
  @Required()
  @Minimum(1)
  @Example(123)
  account_id: Schedule["account_id"];

  @Field(() => String)
  @Description("The ID of the schedule this task belongs to")
  @Required()
  @Pattern(UUIDRegex)
  schedule_id: Schedule["id"];

  @Field(() => Schedule)
  @Description("The schedule this task belongs to")
  @Required()
  schedule: Omit<Schedule, "tasks">;

  @Field(() => Date, {
    nullable: true,
  })
  @Description(
    "The time at which the task started execution, null if not yet started"
  )
  @Example("2021-01-01T00:00:00.000Z")
  start_time: Date | null;

  @Field(() => Int, {
    nullable: true,
  })
  @Description("The duration of the task in milliseconds")
  @Example(200)
  duration: number | null;

  @Field()
  @Description(
    "The type of task, either 'break' or 'work', which determines the type of activity"
  )
  @Required()
  @Example("break")
  @Enum("break", "work")
  type: string;
}
