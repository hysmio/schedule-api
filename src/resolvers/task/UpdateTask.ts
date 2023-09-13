import { Field, ID, InputType } from "type-graphql";
import {
  Description,
  Enum,
  Example,
  Pattern,
  Property,
  Required,
} from "@tsed/schema";

import { UUIDRegex } from "../../helpers/constants";

@InputType()
export class UpdateTask {
  @Field(() => ID, { nullable: true })
  @Property()
  @Description("The ID of this task")
  @Pattern(UUIDRegex)
  id?: string;

  @Field(() => String)
  @Property()
  @Required()
  @Example("break")
  @Enum("break", "work")
  type: string;
}
