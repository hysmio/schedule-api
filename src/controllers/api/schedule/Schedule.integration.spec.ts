import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";

import { ScheduleController } from "./Schedule";

import { Server } from "../../../Server";

import { UUIDRegex } from "../../../helpers/constants";
import { randomUUID } from "crypto";

describe("ScheduleController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(
    PlatformTest.bootstrap(Server, {
      mount: {
        "/api/schedule": [ScheduleController],
      },
    })
  );
  beforeEach(async () => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it("should call GET /api/schedule and get status 200", async () => {
    await request.get("/api/schedule").expect(200);
  });

  it("should call GET /api/schedule/:schedule_id and get the schedule with status 200", async () => {
    const expected = {
      id: "later",
      account_id: 1,
      agent_id: null,
      start_time: new Date(new Date().getTime() + 5000).toISOString(),
      tasks: [
        { type: "break", duration: null, start_time: null, account_id: 1 },
      ],
      end_time: null,
    };

    const res = await request
      .post("/api/schedule")
      .send(expected)
      .expect("Content-Type", /json/)
      .expect(201);

    expected.id = res.body.id;

    const response = await request
      .get(`/api/schedule/${res.body.id}`)
      .expect(200);
    const schedule = response.body;
    expect(schedule).toMatchObject(expected);

    await request.delete(`/api/schedule/${schedule.id}`).expect(200);
  });

  it("should return 404 if no schedule for GET /api/schedule/:schedule_id", async () => {
    await request.get(`/api/schedule/${randomUUID()}`).expect(404);
  });

  it("should call POST /api/schedule and get a valid Schedule returned", async () => {
    const taskType = "break";

    const expected = {
      account_id: 1,
      agent_id: null,
      start_time: new Date(new Date().getTime() + 5000).toISOString(),
      tasks: [
        { type: taskType, duration: null, start_time: null, account_id: 1 },
      ],
      end_time: null,
    };

    const response = await request
      .post("/api/schedule")
      .send(expected)
      .expect("Content-Type", /json/)
      .expect(201);

    const schedule = response.body;
    expect(schedule).toMatchObject(expected);

    // check is uuid
    expect(schedule).toHaveProperty("id");
    expect(schedule.id).toMatch(UUIDRegex);

    await request.delete(`/api/schedule/${schedule.id}`).expect(200);
  });

  it("should get error when trying to create schedule without tasks", async () => {
    const response = await request
      .post("/api/schedule")
      .send({
        account_id: 1,
        start_time: new Date(new Date().getTime() + 10000).toISOString(),
      })
      .expect("Content-Type", /json/)
      .expect(400);

    const schedule = response.body;
    expect(schedule).toMatchObject({
      errors: [
        {
          message: "must have required property 'tasks'",
        },
      ],
    });
  });

  it("should get error when trying to create schedule with empty tasks", async () => {
    const response = await request
      .post("/api/schedule")
      .send({
        account_id: 1,
        start_time: new Date(new Date().getTime() + 10000).toISOString(),
        tasks: [],
      })
      .expect("Content-Type", /json/)
      .expect(400);

    const schedule = response.body;
    expect(schedule).toMatchObject({
      errors: [
        {
          instancePath: "/tasks",
          message: "must NOT have fewer than 1 items",
        },
      ],
    });
  });

  it("should get error when trying to create schedule with a past start_date", async () => {
    const response = await request
      .post("/api/schedule")
      .send({
        account_id: 1,
        start_time: new Date(new Date().getTime() - 10000).toISOString(),
        tasks: [{ type: "break" }],
      })
      .expect("Content-Type", /json/)
      .expect(400);

    const schedule = response.body;
    expect(schedule).toMatchObject({
      errors: [
        {
          instancePath: "/start_time",
          message: "must not be in the past",
        },
      ],
    });
  });

  it("should get error when trying to update schedule with a past start_date", async () => {
    const response = await request
      .post("/api/schedule")
      .send({
        account_id: 1,
        start_time: new Date(new Date().getTime() + 10000).toISOString(),
        tasks: [{ type: "break" }],
      })
      .expect("Content-Type", /json/)
      .expect(201);

    await request
      .put(`/api/schedule/${response.body.id}`)
      .send({
        start_time: new Date(new Date().getTime() - 10000).toISOString(),
      })
      .expect(400);

    await request.delete(`/api/schedule/${response.body.id}`).expect(200);
  });

  it("should call PUT /api/schedule/:schedule_id and get a valid Schedule returned", async () => {
    const taskType = "break";
    const startTime = new Date(new Date().getTime() + 10000);
    const res = await request.post(`/api/schedule`).send({
      account_id: 1,
      start_time: startTime.toISOString(),
      tasks: [{ type: taskType }],
    });

    if (res.status !== 201) {
      console.log(res.body);
      expect(res.status).toBe(201);
    }

    const original = res.body;

    const expected = {
      ...original,
      start_time: new Date(startTime.getTime() + 15000).toISOString(),
      tasks: [{ id: original.tasks[0].id, type: "work" }],
    };

    const body = {
      account_id: expected.account_id,
      start_time: expected.start_time,
      tasks: expected.tasks,
    };

    const response = await request
      .put(`/api/schedule/${original.id}`)
      .send(body)
      .expect("Content-Type", /json/);

    if (response.status !== 200) {
      console.log(response.body);
      expect(response.status).toBe(200);
    }

    const updated = response.body;
    expect(updated).toMatchObject(expected);

    await request.delete(`/api/schedule/${updated.id}`).expect(200);
  });

  it("should get 404 when trying to update a schedule that doesn't exist, when calling PUT /api/schedule/:schedule_id", async () => {
    await request
      .put(`/api/schedule/${randomUUID()}`)
      .send({
        account_id: 1,
      })
      .expect("Content-Type", /json/)
      .expect(404);
  });
});
