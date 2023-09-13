/**
 * Contains types for the task controller
 */

export type CreateTaskRequest = {
  schedule_id: string;
  type: string;
};

export type UpdateTaskRequest = {
  type: string;
};
