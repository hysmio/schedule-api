import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";

import { TaskController } from "./Task";

import { Server } from "../../../Server";
import { Schedule } from "../../../resolvers";
import { ScheduleController } from "../schedule/Schedule";
import { randomUUID } from "crypto";

describe("TaskController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;
  let schedule: Schedule;
  const createSchedule = async (
    request: SuperTest.SuperTest<SuperTest.Test>
  ) => {
    const response = await request.post("/api/schedule").send({
      account_id: 1,
      start_time: new Date(new Date().getTime() + 15000).toISOString(),
      tasks: [{ type: "break" }],
    });

    if (response.status !== 201) {
      console.log(response.body);
      expect(response.status).toEqual(201);
    }

    return response.body;
  };

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        "/api/task": [TaskController],
        "/api/schedule": [ScheduleController],
      },
    })
  );
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());

    schedule = await createSchedule(request);
  });

  afterEach(async () => {
    await request.delete(`/api/schedule/${schedule.id}`).expect(200);
  });

  it("should call /api/task and get status 200", async () => {
    await request.get("/api/task").expect(200);
  });

  it("should get schedule.tasks[0] when calling /api/task/:task_id", async () => {
    const response = await request
      .get(`/api/task/${schedule.tasks[0].id}`)
      .expect(200);

    expect(response.body).toMatchObject(schedule.tasks[0]);
  });

  it("should return 404 when calling /api/task/:task_id with unknown value", async () => {
    await request.get(`/api/task/${randomUUID}`).expect(404);
  });

  it("should be able to create a new task under schedule when calling POST /api/task/", async () => {
    const expected = {
      schedule_id: schedule.id,
      type: "break",
      schedule: {
        ...schedule,
        tasks: undefined,
      },
      duration: null,
      start_time: null,
    };

    delete expected.schedule.tasks;

    const response = await request
      .post(`/api/task`)
      .send({ schedule_id: schedule.id, type: "break" })
      .expect(201);

    expect(response.body).toMatchObject(expected);
  });

  it("should get 404 when trying to create a new task under schedule that doesn't exist, when calling POST /api/task/", async () => {
    await request
      .post(`/api/task`)
      .send({ schedule_id: randomUUID(), type: "break" })
      .expect(404);
  });

  it("should be able to update task under schedule when calling PUT /api/task/:task_id", async () => {
    const expected = {
      ...schedule.tasks[0],
      type: "work",
    };

    const response = await request
      .put(`/api/task/${schedule.tasks[0].id}`)
      .send({ type: "work" })
      .expect(200);

    expect(response.body).toMatchObject(expected);
  });

  it("should be able to delete task under schedule when calling PUT /api/task/:task_id", async () => {
    const res = await request
      .post(`/api/task`)
      .send({ schedule_id: schedule.id, type: "break" })
      .expect(201);

    await request.delete(`/api/task/${res.body.id}`).expect(200);
  });
});
