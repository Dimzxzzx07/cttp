import CTTPClient from "../src/core/CTTPClient";

async function resumableUploadExample() {
  const client = new CTTPClient({
    logLevel: "info"
  });

  try {
    console.log("=== Resumable Upload Example ===");

    const upload = await client.resumableUpload(
      "https://api.example.com/upload",
      "large-file.bin",
      {
        chunkSize: 1024 * 1024,
        parallelChunks: 4,
        onProgress: (progress: number) => {
          console.log(`Upload progress: ${progress.toFixed(2)}%`);
        }
      }
    );
    console.log("Upload completed:", upload.getStatus());

    await client.close();
  } catch (error) {
    console.error("Upload error:", error);
  }
}

resumableUploadExample();