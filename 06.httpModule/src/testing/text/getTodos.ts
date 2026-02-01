const URL = "http://localhost:3000/api/todos/text";

async function testGet() {
  console.log("Testing GET /api/todos/text...");
  try {
    const response = await fetch(URL);
    const data = await response.text();
    console.log("Status:", response.status);
    console.log("Response Body:\n", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testGet();
