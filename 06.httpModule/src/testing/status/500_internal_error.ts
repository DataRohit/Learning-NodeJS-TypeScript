const URL = "http://localhost:3000/api/status/500";

async function test500() {
  console.log("Testing Status Code 500 (Internal Server Error)...");
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log("Status Received:", response.status, response.statusText);
    console.log("Response Body:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test500();
