import { NotFound } from "@tsed/exceptions";

export class ScheduleNotFoundError extends NotFound {
  constructor(private id: string) {
    super("Schedule not found");
  }
}
