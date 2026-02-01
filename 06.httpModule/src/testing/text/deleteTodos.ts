const URL = "http://localhost:3000/api/todos/text";

async function testDelete() {
  console.log("Testing DELETE /api/todos/text...");

  try {
    const response = await fetch(URL, {
      method: "DELETE",
    });
    const data = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testDelete();
