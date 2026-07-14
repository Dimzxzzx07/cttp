import { ResumableUploader } from "../../src/core/ResumableUploader";

describe("ResumableUploader", () => {
  let uploader: ResumableUploader;

  beforeEach(() => {
    uploader = new ResumableUploader({
      chunkSize: 1024,
      parallelChunks: 2
    });
  });

  afterEach(async () => {
    await uploader.close();
  });

  test("should create instance", () => {
    expect(uploader).toBeDefined();
  });

  test("should generate session id", () => {
    const sessions = uploader.getActiveSessions();
    expect(sessions).toBeDefined();
  });

  test("should handle upload progress", () => {
    const sessionId = "test-session";
    const progress = uploader.getProgress(sessionId);
    expect(progress).toBe(0);
  });
});