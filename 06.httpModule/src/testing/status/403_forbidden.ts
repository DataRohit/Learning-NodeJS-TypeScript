const URL = "http://localhost:3000/api/status/403";

async function test403() {
  console.log("Testing Status Code 403 (Forbidden)...");
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log("Status Received:", response.status, response.statusText);
    console.log("Response Body:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test403();
