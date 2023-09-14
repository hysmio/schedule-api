import { Field, ID, ObjectType, Int } from "type-graphql";
import {
  ArrayOf,
  Description,
  Example,
  Groups,
  Minimum,
  Pattern,
  Required,
} from "@tsed/schema";

import { Task } from "../task/Task";
import { UUIDRegex } from "../../helpers/constants";

@ObjectType({
  description:
    "A Schedule which defines a start time, end time & a list of tasks to be executed",
})
export class Schedule {
  @Field(() => ID)
  @Description("The ID of this schedule")
  @Required()
  @Pattern(UUIDRegex)
  @Example("123e4567-e89b-12d3-a456-426614174000")
  id: string;

  @Field()
  @Description("The ID of the account this schedule belongs to")
  @Required()
  @Minimum(1)
  @Example(123)
  account_id: number;

  @Field(() => Int, { nullable: true })
  @Description("The ID of the agent this schedule will be executed on")
  @Minimum(0)
  @Example(123)
  agent_id: number | null;

  @Field(() => Date)
  @Description("The time at which the schedule should start")
  @Example("2023-01-01T00:02:32.136Z")
  start_time: Date;

  @Field(() => Date, { nullable: true })
  @Description("The time at which the schedule ended execution")
  @Example("2023-01-01T00:02:32.136Z")
  end_time: Date | null;

  @Groups("with.tasks", "!with.schedule")
  @Field(() => [Task])
  @Description("The tasks that were executed as part of this schedule")
  @ArrayOf(Task)
  tasks: Task[];
}
