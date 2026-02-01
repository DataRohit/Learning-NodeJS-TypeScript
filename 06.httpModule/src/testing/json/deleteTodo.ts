const URL = "http://localhost:3000/api/todos/json";

interface Todo {
  id: number;
  task: string;
  completed: boolean;
}

async function testDelete() {
  console.log("Testing DELETE /api/todos/json...");

  try {
    // First get an ID
    const getRes = await fetch(URL);
    const todos = (await getRes.json()) as Todo[];

    if (todos.length === 0) {
      console.log("No todos to delete.");
      return;
    }

    const id = todos[0].id;
    console.log(`Deleting todo ID: ${id}`);

    const response = await fetch(URL, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    const data = await response.json();
    console.log("Status:", response.status);
    console.log("Response:", data);
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testDelete();
