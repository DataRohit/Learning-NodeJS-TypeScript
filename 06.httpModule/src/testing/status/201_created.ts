const URL = "http://localhost:3000/api/status/201";

async function test201() {
  console.log("Testing Status Code 201 (Created)...");
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log("Status Received:", response.status, response.statusText);
    console.log("Response Body:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test201();
