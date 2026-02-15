import { createClient } from "redis";
import { redisConfig } from "./config.js";

async function runPubSubDemo() {
  console.log("--- Pub/Sub Demo ---");

  const subscriber = createClient(redisConfig);
  const publisher = createClient(redisConfig);

  await subscriber.connect();
  await publisher.connect();

  // Subscribe to a channel
  const channel = "updates";
  await subscriber.subscribe(channel, (message) => {
    console.log(`[Subscriber] Received message from "${channel}":`, message);
  });

  // Publish a message
  console.log(`[Publisher] Sending message to "${channel}"...`);
  await publisher.publish(channel, "Hello from AntiGravity!");

  // Wait a bit to see the message
  await new Promise((resolve) => setTimeout(resolve, 1000));

  await subscriber.unsubscribe(channel);
  subscriber.destroy();
  publisher.destroy();
  console.log("--- Pub/Sub Demo Ended ---");
}

runPubSubDemo().catch(console.error);
