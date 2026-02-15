import { Redis } from "ioredis";
import { redisConfig } from "./config.js";

// ioredis connection string format or options
// Note: ioredis uses host/port/password properties directly
const redis = new Redis({
  host: redisConfig.socket.host,
  port: redisConfig.socket.port,
  password: redisConfig.password,
  username: redisConfig.username,
});

async function runIoRedisDemo() {
  console.log("--- ioredis Demo ---");

  try {
    // Set
    await redis.set("ioredis:key", "Working with ioredis");
    console.log("Set ioredis:key");

    // Get
    const val = await redis.get("ioredis:key");
    console.log("Got value from ioredis ->", val);

    // Multiple operations using Pipeline
    console.log("Running pipeline...");
    const pipeline = redis.pipeline();
    pipeline.set("pipe:1", "A");
    pipeline.set("pipe:2", "B");
    pipeline.get("pipe:1");
    const results = await pipeline.exec();
    console.log("Pipeline results:", JSON.stringify(results, null, 2));
  } catch (error) {
    console.error("ioredis error:", error);
  } finally {
    redis.disconnect();
  }
}

runIoRedisDemo().catch(console.error);
