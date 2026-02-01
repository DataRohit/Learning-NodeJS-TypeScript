export function printArrayWithDelay(arr: any[]): void {
  console.log("--- Array printing task ---");
  console.log("Array content:", arr);

  arr.forEach((item, index) => {
    console.log(`[${index}]: ${item}`);
  });

  console.log("Setting a timeout for 2 seconds...");
  setTimeout(() => {
    console.log(">>> Timeout Callback: Task complete!");
  }, 2000);
}
