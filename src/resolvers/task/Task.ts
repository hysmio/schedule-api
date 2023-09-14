import { Field, ID, ObjectType, Int } from "type-graphql";
import {
  Description,
  Enum,
  Example,
  Groups,
  Minimum,
  Pattern,
  Property,
  Required,
} from "@tsed/schema";

import { Schedule } from "../schedule/Schedule";
import { UUIDRegex } from "../../helpers/constants";

@ObjectType({
  description: "A task which is to be executed as part of a schedule",
})
export class Task {
  @Field(() => ID)
  @Description("The ID of this task")
  @Required()
  @Pattern(UUIDRegex)
  @Example("0123e4567-e89b-12d3-a456-42661417400")
  id: string;

  @Field(() => Int)
  @Description("The ID of the account this task belongs to")
  @Required()
  @Minimum(1)
  @Example(123)
  account_id: number;

  @Field(() => String)
  @Description("The ID of the schedule this task belongs to")
  @Required()
  @Pattern(UUIDRegex)
  @Example("123e4567-e89b-12d3-a456-426614174000")
  schedule_id: string;

  @Field(() => Schedule)
  @Description("The tasks that were executed as part of this schedule")
  @Property(() => Schedule)
  @Groups("with.schedule")
  schedule: Schedule;

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
