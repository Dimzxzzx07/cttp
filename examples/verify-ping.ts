import CTTPClient from "../src/core/CTTPClient";

async function verifyPingExample() {
  const client = new CTTPClient({
    logLevel: "info"
  });

  try {
    console.log("=== Verify & Ping Example ===");

    const otpValid = await client.verifyOTP("https://api.example.com/verify", "123456");
    console.log("OTP valid:", otpValid);

    const emailValid = await client.verifyEmail("https://api.example.com/verify", "test@example.com");
    console.log("Email valid:", emailValid);

    const healthy = await client.pingHealth("https://api.example.com/health");
    console.log("Health check:", healthy);

    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

verifyPingExample();