const URL = "http://localhost:3000/api/status/400";

async function test400() {
  console.log("Testing Status Code 400 (Bad Request)...");
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log("Status Received:", response.status, response.statusText);
    console.log("Response Body:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test400();
