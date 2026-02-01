import { TicketSystem } from "./emitters/TicketSystem.js";
import { setupListeners } from "./listeners/TicketListeners.js";

console.log("=== Node.js Event Emitters & Listeners Demo ===\n");

// 1. Initialize the custom emitter
const helpDesk = new TicketSystem();

// 2. Setup the listeners
setupListeners(helpDesk);

// 3. Emit some events
console.log("--- Action: Creating Tickets ---");
helpDesk.createTicket("Alice", "Internet is down");

setTimeout(() => {
  helpDesk.createTicket("Bob", "Keyboard is missing a key");
}, 500);

setTimeout(() => {
  console.log("\n--- Action: Resolving Ticket ---");
  helpDesk.resolveTicket("T-12345"); // Sample ID
}, 1000);

setTimeout(() => {
  console.log("\n--- Demo Completed ---");
}, 1500);
