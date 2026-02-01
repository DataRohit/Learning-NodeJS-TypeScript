import { TicketSystem } from "../emitters/TicketSystem.js";

export function setupListeners(system: TicketSystem) {
  // Listener 1: Logging everything
  system.on("ticketCreated", (ticket) => {
    console.log(
      `[Listener - Logger] New ticket logged: ${ticket.id} by ${ticket.user}`,
    );
  });

  // Listener 2: "Notification" service
  system.on("ticketCreated", (ticket) => {
    console.log(
      `[Listener - Notification] Email sent to admin for user ${ticket.user}: "${ticket.issue}"`,
    );
  });

  // Listener 3: Resolve confirmation
  system.on("ticketResolved", (id) => {
    console.log(`[Listener - Status] Ticket ${id} is now CLOSED.`);
  });

  // Listener 4: Special case (once)
  system.once("ticketCreated", () => {
    console.log(
      "[Listener - System] First ticket of the session received! Initializing support queue...",
    );
  });
}
