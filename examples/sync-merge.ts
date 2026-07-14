import CTTPClient from "../src/core/CTTPClient";

async function syncMergeExample() {
  const client = new CTTPClient({
    logLevel: "info"
  });

  try {
    console.log("=== Sync & Merge Example ===");

    const syncResult = await client.syncData(
      "https://api.example.com/data",
      new Date(Date.now() - 3600000).toISOString()
    );
    console.log("Sync changes:", syncResult.changes.length);

    if (syncResult.conflicts.length > 0) {
      const mergeResult = await client.mergeData(
        "https://api.example.com/merge",
        syncResult.conflicts,
        { strategy: "union" }
      );
      console.log("Merge resolved:", mergeResult.resolved.length);
    }

    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

syncMergeExample();