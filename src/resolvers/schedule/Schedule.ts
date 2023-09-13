import { Field, ID, ObjectType, Int } from "type-graphql";
import { Task } from "../task/Task";
import { UUIDRegex } from "../../helpers/constants";
import { Description, Example, Minimum, Pattern, Required } from "@tsed/schema";

@ObjectType({
  description:
    "A Schedule which defines a start time, end time & a list of tasks to be executed",
})
export class Schedule {
  @Field(() => ID)
  @Required()
  @Pattern(UUIDRegex)
  id: string;

  @Field()
  @Description("The ID of the account this schedule belongs to")
  @Required()
  @Minimum(1)
  @Example(123)
  account_id: number;

  @Field(() => Int)
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

  @Field(() => [Task])
  @Description("The tasks that were executed as part of this schedule")
  tasks: Omit<Task, "schedule">[];
}
