import CTTPClient from "../src/core/CTTPClient";

async function convertArchiveExample() {
  const client = new CTTPClient({
    logLevel: "info"
  });

  try {
    console.log("=== Convert & Archive Example ===");

    const converted = await client.convertFile(
      "https://api.example.com/convert",
      "image.png",
      "webp",
      { quality: 80 }
    );
    console.log("Converted format:", converted.format);

    const archived = await client.archiveData(
      "https://api.example.com/archive",
      { action: "compress", format: "gzip" }
    );
    console.log("Archive ID:", archived.archiveId);

    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

convertArchiveExample();