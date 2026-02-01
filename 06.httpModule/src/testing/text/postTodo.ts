const URL = "http://localhost:3000/api/todos/text";

async function testPost() {
  console.log("Testing POST /api/todos/text...");
  const newTodo = "Buy groceries - " + new Date().toLocaleTimeString();

  try {
    const response = await fetch(URL, {
      method: "POST",
      body: newTodo,
    });
    const data = await response.text();
    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testPost();
