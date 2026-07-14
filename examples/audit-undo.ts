import CTTPClient from "../src/core/CTTPClient";

async function auditUndoExample() {
  const client = new CTTPClient({
    logLevel: "info"
  });

  try {
    console.log("=== Audit & Undo Example ===");

    const audit = await client.auditLogs("https://api.example.com/resource/123", {
      limit: 50,
      startTime: new Date(Date.now() - 86400000).toISOString()
    });
    console.log("Audit entries:", audit.entries.length);

    const undo = await client.undoLast("https://api.example.com/resource/123");
    console.log("Undo status:", undo.status);

    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

auditUndoExample();