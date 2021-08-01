export enum TaskStatus {
  /**
   * The task is successfully accomplished with no errors.
   */
  Ended,
  /**
   * The task could not be accomplished due to some errors.
   */
  Error,
  /**
   * The task is being accomplished.
   */
  InProgress,
  /**
   * The task is not started.
   */
  NotStarted,
}
