const URL = "http://localhost:3000/api/status/204";

async function test204() {
  console.log("Testing Status Code 204 (No Content)...");
  try {
    const response = await fetch(URL);
    console.log("Status Received:", response.status, response.statusText);
    console.log(
      "Response Body: (Should be empty)",
      response.body ? "Exists" : "Empty",
    );
  } catch (error) {
    console.error("Test failed:", error);
  }
}

test204();
