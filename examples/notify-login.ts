import CTTPClient from "../src/core/CTTPClient";

async function notifyLoginExample() {
  const client = new CTTPClient({
    logLevel: "info"
  });

  try {
    console.log("=== Notify & Login Example ===");

    const login = await client.login("https://api.example.com/login", {
      username: "testuser",
      password: "testpass123"
    });
    console.log("Login successful");

    await client.notifyEvent(
      "https://api.example.com/notify",
      "user.login",
      {
        userId: "123",
        timestamp: new Date().toISOString(),
        ip: "192.168.1.1"
      }
    );
    console.log("Notification sent");

    const logout = await client.logout("https://api.example.com/logout");
    console.log("Logout successful:", logout.getStatus());

    await client.close();
  } catch (error) {
    console.error("Error:", error);
  }
}

notifyLoginExample();