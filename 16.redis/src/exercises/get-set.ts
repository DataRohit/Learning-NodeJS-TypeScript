import { createClient } from "redis";
import { redisConfig } from "./config.js";

const client = createClient(redisConfig);

client.on("error", (err) => console.log("Redis Client Error", err));

async function runGetSetDemo() {
  console.log("--- Get/Set Demo ---");
  await client.connect();

  // SET
  await client.set("user:name", "AntiGravity");
  console.log("Set user:name to AntiGravity");

  // GET
  const name = await client.get("user:name");
  console.log("Result of GET user:name ->", name);

  // SET with Expiry (10 seconds)
  await client.set("temp_token", "xyz123", { EX: 10 });
  console.log("Set temp_token with 10s expiry");

  client.destroy();
}

runGetSetDemo().catch(console.error);
