import { createClient } from "redis";
import { redisConfig } from "./config.js";

const client = createClient(redisConfig);

client.on("error", (err) => console.log("Redis Client Error", err));

async function runDataStructuresDemo() {
  console.log("--- Data Structures Demo ---");
  await client.connect();

  // 1. Lists (LPUSH, RPUSH, LRANGE)
  console.log("\n--- Lists ---");
  await client.del("tasks");
  await client.lPush("tasks", "Learn Redis");
  await client.rPush("tasks", "Build App");
  const tasks = await client.lRange("tasks", 0, -1);
  console.log("Tasks list:", tasks);

  // 2. Sets (SADD, SMEMBERS) - Unique elements
  console.log("\n--- Sets ---");
  await client.del("tags");
  await client.sAdd("tags", ["nodejs", "typescript", "redis", "nodejs"]);
  const tags = await client.sMembers("tags");
  console.log("Tags set (unique):", tags);

  // 3. Hashes (HSET, HGETALL) - Objects
  console.log("\n--- Hashes ---");
  await client.hSet("user:101", {
    id: "101",
    username: "rohit",
    email: "rohit@example.com",
  });
  const userData = await client.hGetAll("user:101");
  console.log("User Hash Data:", userData);

  client.destroy();
}

runDataStructuresDemo().catch(console.error);
