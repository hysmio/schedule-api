# Leonardo AI Tech Test

Hey! This is my submission, some things were rushed just due to time constraints & wanting to not delay everyone.
Ended up choosing to use:

- [tsed](https://tsed.io)
- Rest API focused - GraphQL API supported, untested, didn't do lambda for time sakes.
- Postgres w/ Prisma, planned on implementing caching layer, but again, time.

I realised halfway through that task endpoints should probably exist under schedules, but for the sake of time I didn't make this change:

- `GET /api/task` -> `GET /api/schedule/:schedule_id/task`
- `POST /api/task` -> `POST /api/schedule/:schedule_id/task`
- `GET /api/task/:task_id` -> `/api/schedule/:schedule_id/task/:task_id`
- `PUT /api/task/:task_id` -> `/api/schedule/:schedule_id/task/:task_id`
- `DELETE /api/task/:task_id` -> `/api/schedule/:schedule_id/task/:task_id`

A few more things:

- Focused on the Rest API & didn't write tests for GraphQL API
- Wrote tests in a lot more e2e fashion and less unit "test-y" (as I find it more useful, didn't see the big heading in readme for "thorough" unit tests)
- You can delete all the tasks of a schedule, bypassing the limit, this might also break the ability to fetch it. Easy enough fix.
- Could've probably avoided `CreateTask`, `UpdateTask`, `CreateSchedule`, `UpdateSchedule` & `UpdateScheduleTask` by using the [@tsed/schema.Groups concept defined here](https://tsed.io/docs/model.html#groups). I hadn't actually used tsed before, so I just wasn't fully aware of all the capability & couldn't dedicate time to learning the whole framework. The multiple struct pattern is what we typically use in Golang.

## To run

There's a [Makefile](/Makefile) to create a postgres database & run migrations.

```sh
  # Create postgres in Docker, ensure it's running!
  make postgres

  # Pull dependencies
  yarn

  # Run the Prisma migrations
  make migrations

  # Run the application in development
  yarn start

  # Make sure you clean up the database!
  docker stop leonardo-ai
```

## To run tests

```sh
  # Create postgres in Docker, ensure it's running!
  make postgres

  # Pull dependencies
  yarn

  # Run the Prisma migrations
  make migrations

  # Run the application in development
  yarn test

  # Make sure you clean up the database!
  docker stop leonardo-ai
```
