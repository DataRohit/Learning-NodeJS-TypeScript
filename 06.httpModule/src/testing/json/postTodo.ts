const URL = "http://localhost:3000/api/todos/json";

async function testPost() {
  console.log("Testing POST /api/todos/json...");
  const newTodo = { task: "Learn Node.js Testing" };

  try {
    const response = await fetch(URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Created Todo:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testPost();
