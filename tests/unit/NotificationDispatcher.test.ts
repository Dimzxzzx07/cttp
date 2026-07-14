import { NotificationDispatcher } from "../../src/core/NotificationDispatcher";

describe("NotificationDispatcher", () => {
  let dispatcher: NotificationDispatcher;

  beforeEach(() => {
    dispatcher = new NotificationDispatcher({
      timeout: 5000,
      retryOnFailure: true,
      maxRetries: 3,
      retryDelay: 1000
    });
  });

  afterEach(async () => {
    await dispatcher.close();
  });

  test("should create instance", () => {
    expect(dispatcher).toBeDefined();
  });

  test("should subscribe to event", () => {
    const callback = jest.fn();
    dispatcher.subscribe("test-event", callback);
    expect(dispatcher.getSubscribers("test-event")).toBe(1);
  });

  test("should unsubscribe from event", () => {
    const callback = jest.fn();
    dispatcher.subscribe("test-event", callback);
    dispatcher.unsubscribe("test-event", callback);
    expect(dispatcher.getSubscribers("test-event")).toBe(0);
  });

  test("should get queue length", () => {
    expect(dispatcher.getQueueLength()).toBe(0);
  });

  test("should clear queue", () => {
    dispatcher.clearQueue();
    expect(dispatcher.getQueueLength()).toBe(0);
  });
});