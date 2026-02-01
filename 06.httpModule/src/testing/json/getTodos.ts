const URL = "http://localhost:3000/api/todos/json";

async function testGet() {
  console.log("Testing GET /api/todos/json...");
  try {
    const response = await fetch(URL);
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response Body:", JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testGet();
