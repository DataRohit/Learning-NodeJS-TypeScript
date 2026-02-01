const URL = "http://localhost:3000/api/todos/text";

async function testPut() {
  console.log("Testing PUT /api/todos/text...");
  const updatedContent = "1. First task updated\n2. Second task appended";

  try {
    const response = await fetch(URL, {
      method: "PUT",
      body: updatedContent,
    });
    const data = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testPut();
