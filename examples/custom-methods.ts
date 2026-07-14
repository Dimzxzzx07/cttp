import CTTPClient from "../src/core/CTTPClient";

async function customMethodsExample() {
  const client = new CTTPClient({
    enableTunnel: true,
    logLevel: "info"
  });

  try {
    console.log("=== Custom Methods Example ===");

    const login = await client.login("https://api.example.com/login", {
      username: "testuser",
      password: "testpass123"
    });
    console.log("Login:", login.getStatus());

    const sync = await client.sync("https://api.example.com/sync", {
      lastSync: new Date().toISOString()
    });
    console.log("Sync:", sync.getStatus());

    const ping = await client.ping("https://api.example.com/health");
    console.log("Ping:", ping.getStatus());

    const verify = await client.verify("https://api.example.com/verify", {
      type: "email",
      value: "test@example.com"
    });
    console.log("Verify:", verify.getStatus());

    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

customMethodsExample();